'use client';

import { useState, useCallback, useEffect } from 'react';
import { Message, ConversationStep, ProcessingState, EditingDetails } from '@/lib/types';
import { initializeFirebase, useUser, useAuth } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp, addDoc, onSnapshot } from 'firebase/firestore';
import { uploadVideoFile } from '@/lib/storage-utils';
import { runSubmagicEdit } from '@/ai/flows/submagic-video-edit';
import { useRouter } from 'next/navigation';

let messageIdCounter = 0;
const getUniqueId = () => `msg_${Date.now()}_${messageIdCounter++}`;

export function useConversation() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationStep, setConversationStep] = useState<ConversationStep>(ConversationStep.WELCOME);
  const [isLoading, setIsLoading] = useState(false);
  const [editingDetails, setEditingDetails] = useState<EditingDetails>({
    videoFile: null,
    trainingFile: null,
    template: '',
    customDetails: '',
    instructions: '',
    summaryPlan: null,
    editedVideoUrl: null,
  });
  const [isCanvasOpen, setCanvasOpen] = useState(false);
  const [confirmationTimer, setConfirmationTimer] = useState<NodeJS.Timeout | null>(null);
  
  const updateMessage = (id: string, updates: Partial<Message>) => {
    setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, ...updates } : msg));
  };

  const addMessage = useCallback((message: Omit<Message, 'id'>) => {
    const newMessage = { ...message, id: getUniqueId() };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  }, []);

  const simulateThinking = (duration = 1000) => new Promise(resolve => setTimeout(resolve, duration));

  const handleConfirmation = useCallback(async (confirmed: boolean, newInstructions?: string) => {
    if (confirmationTimer) {
        clearTimeout(confirmationTimer);
        setConfirmationTimer(null);
    }
    setIsLoading(true);
  
    if (confirmed) {
      addMessage({ role: 'user', content: 'Yes, proceed.' });
      await simulateThinking();
      
      // Strict Auth Check
      if (!user || user.isAnonymous) {
        router.push('/login');
        setIsLoading(false);
        return;
      }

      setConversationStep(ConversationStep.PROCESSING);
      
      try {
        const { firestore } = initializeFirebase();
        
        const videoFile = editingDetails.videoFile;
        if (!videoFile) throw new Error('No video file selected.');
        
        const timestamp = Date.now();
        const storagePath = `users/${user.uid}/videos/${timestamp}_${videoFile.name}`;
        const publicUrl = await uploadVideoFile(videoFile, storagePath);

        const conversationId = 'conv_' + timestamp;
        const jobId = 'job_' + timestamp;
        
        const jobRef = doc(firestore, `users/${user.uid}/conversations/${conversationId}/videoEditingJobs/${jobId}`);
        await setDoc(jobRef, {
          id: jobId,
          userId: user.uid,
          conversationId: conversationId,
          originalMediaFileId: 'initial_upload',
          customInstructions: editingDetails.instructions,
          status: 'pending',
          progress: 0,
          currentStep: 0,
          creditCost: 1,
          createdAt: serverTimestamp(),
        });

        const initialState: ProcessingState = {
          videoUrl: publicUrl,
          progress: 0,
          currentStep: 0,
        };
        const processingMessageId = addMessage({ role: 'assistant', content: '', type: 'processing', processingState: initialState });

        const unsubscribe = onSnapshot(jobRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            updateMessage(processingMessageId, {
              processingState: {
                ...initialState,
                progress: data.progress || 0,
                currentStep: Math.floor((data.progress || 0) / 12.5),
                isCollapsibleOpen: data.status !== 'completed'
              }
            });

            if (data.status === 'completed') {
              unsubscribe();
              setEditingDetails(prev => ({...prev, editedVideoUrl: data.editedVideoUrl }));
              setCanvasOpen(true);
              setConversationStep(ConversationStep.DONE);
              addMessage({ role: 'assistant', content: 'Your video is ready. Review it in the preview canvas!', type: 'final-video' });
              setIsLoading(false);
            } else if (data.status === 'error') {
              unsubscribe();
              addMessage({ role: 'assistant', content: `Error: ${data.error || 'The editing process failed.'}`, type: 'error' });
              setConversationStep(ConversationStep.AWAITING_INSTRUCTIONS);
              setIsLoading(false);
            }
          }
        });

        runSubmagicEdit({
          userId: user.uid,
          conversationId: conversationId,
          jobId: jobId,
          videoUrl: publicUrl,
          templateName: editingDetails.template
        }).catch(err => {
          console.error('Flow failed:', err);
        });

      } catch (error: any) {
        addMessage({ role: 'assistant', content: `Something went wrong: ${error.message}`, type: 'error' });
        setIsLoading(false);
      }
  
    } else {
      addMessage({ role: 'user', content: newInstructions || 'No, I have changes.' });
      await simulateThinking();
      addMessage({ role: 'assistant', content: 'No problem. Please provide your updated instructions.' });
      setConversationStep(ConversationStep.AWAITING_INSTRUCTIONS);
      setEditingDetails(prev => ({...prev, summaryPlan: null}));
      setIsLoading(false);
    }
  }, [addMessage, confirmationTimer, editingDetails, user, router]);

  const sendMessage = useCallback(async (message: string, files?: File[]) => {
    // Wait for initial auth state determination
    if (isUserLoading) return;

    // Auth Guard: Redirect immediately if not logged in
    if (!user || user.isAnonymous) {
      router.push('/login');
      return;
    }

    setIsLoading(true);

    if (message.trim() || (files && files.length > 0)) {
        addMessage({ role: 'user', content: message.trim(), attachments: files });
    }

    await simulateThinking();
    const file = files?.[0];

    switch (conversationStep) {
        case ConversationStep.WELCOME:
            if (file) {
                setEditingDetails(prev => ({ ...prev, videoFile: file, instructions: message }));
                addMessage({ role: 'assistant', content: `Great, your footage is uploaded. Now, please select an editing style for your video.`, type: 'template-selection' });
                setConversationStep(ConversationStep.AWAITING_TEMPLATE);
            } else {
                setEditingDetails(prev => ({ ...prev, instructions: message }));
                addMessage({ role: 'assistant', content: `Hi, I'm Zuckky AI, here to help you edit your videos to go viral. To get started, please give me some instructions or upload your footage.` });
                setConversationStep(ConversationStep.AWAITING_VIDEO);
            }
            break;
        
        case ConversationStep.AWAITING_VIDEO:
            if (file) {
                setEditingDetails(prev => ({ ...prev, videoFile: file, instructions: message }));
                addMessage({ role: 'assistant', content: `Great, your footage is uploaded. Now, please select an editing style for your video.`, type: 'template-selection' });
                setConversationStep(ConversationStep.AWAITING_TEMPLATE);
            } else {
                setEditingDetails(prev => ({ ...prev, instructions: message }));
                addMessage({ role: 'assistant', content: `I have your instructions. Please upload your footage to continue.` });
                setConversationStep(ConversationStep.AWAITING_VIDEO);
            }
            break;

        case ConversationStep.AWAITING_CUSTOM_DETAILS:
            if (file) {
                setEditingDetails(prev => ({ ...prev, trainingFile: file }));
                addMessage({ role: 'assistant', content: 'Thank you. I have been trained on your unique editing style. Any other special instructions for editing?' });
                setConversationStep(ConversationStep.AWAITING_INSTRUCTIONS);
            } else {
                addMessage({ role: 'assistant', content: 'Please upload a video file for training.' });
            }
            break;

        case ConversationStep.AWAITING_INSTRUCTIONS:
            setEditingDetails(prev => ({ ...prev, instructions: message }));
            setConversationStep(ConversationStep.AWAITING_CONFIRMATION);
            const summary = {
                Topic: `Video edit using ${editingDetails.template} style`,
                'Your Instructions': `"${message}"`,
                'Script Plan': 'The script will be automatically generated from the info provided.',
                'Target Language': 'English (United States)',
                'Supplemental Footage (B-roll)': 'AI illustration with a biological motion style',
                Captions: 'Enabled',
                ...(editingDetails.customDetails && { 'Custom Training': `Based on the video provided` }),
            };
            setEditingDetails(prev => ({ ...prev, summaryPlan: summary }));
            addMessage({ 
                role: 'assistant', 
                content: '', 
                type: 'confirmation',
                summaryDetails: summary
            });
            const timer = setTimeout(() => handleConfirmation(true), 60000);
            setConfirmationTimer(timer);
            break;

        case ConversationStep.AWAITING_CONFIRMATION:
            if (message.toLowerCase().trim() === 'yes') {
                handleConfirmation(true);
            } else {
                handleConfirmation(false, message);
            }
            break;
        
        case ConversationStep.DONE:
            if (message.toLowerCase().includes("new video")) {
                // reset logic
                setConversationStep(ConversationStep.AWAITING_VIDEO);
                addMessage({ role: 'assistant', content: 'Ready for a new project! Please upload your footage.' });
            }
            break;

        default:
            addMessage({ role: 'assistant', content: "I'm not sure how to handle that right now." });
            break;
    }
    setIsLoading(false);
  }, [conversationStep, addMessage, editingDetails, handleConfirmation, user, isUserLoading, router]);

  const handleTemplateSelection = useCallback(async (template: string) => {
    // Auth Guard
    if (!user || user.isAnonymous) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    addMessage({ role: 'user', content: `Selected template: ${template}` });
    setEditingDetails(prev => ({ ...prev, template }));
    await simulateThinking();

    if (template === 'Custom') {
      addMessage({ role: 'assistant', content: 'To create a custom style, please upload a video for me to learn from.' });
      setConversationStep(ConversationStep.AWAITING_CUSTOM_DETAILS);
    } else {
      addMessage({ role: 'assistant', content: 'Got it. Any other editing instructions?' });
      setConversationStep(ConversationStep.AWAITING_INSTRUCTIONS);
    }
    setIsLoading(false);
  }, [addMessage, user, router]);

  return {
    messages,
    sendMessage,
    isLoading,
    isCanvasOpen,
    setCanvasOpen,
    editedVideoUrl: editingDetails.editedVideoUrl,
    conversationStep,
    handleTemplateSelection,
    handleConfirmation,
  };
}
