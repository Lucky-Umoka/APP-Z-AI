'use client';

import { useState, useCallback, useEffect } from 'react';
import { Message, ConversationStep, ProcessingState, EditingDetails } from '@/lib/types';

let messageIdCounter = 0;
const getUniqueId = () => `msg_${Date.now()}_${messageIdCounter++}`;

const initialWelcomeMessage: Message = {
  id: getUniqueId(),
  role: 'assistant',
  content: "Hi, I'm Zuckky AI, here to help you edit your videos to go viral. To get started, please give me some instructions or upload your footage.",
  type: 'text'
};

const PROCESSING_STEP_DURATION = 1500;
const TOTAL_PROCESSING_STEPS = 8;

export function useConversation() {
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

  const resetForNewVideo = () => {
    setEditingDetails({
        videoFile: null,
        trainingFile: null,
        template: '',
        customDetails: '',
        instructions: '',
        summaryPlan: null,
        editedVideoUrl: null,
    });
    setConversationStep(ConversationStep.AWAITING_VIDEO);
    addMessage({ role: 'assistant', content: 'Great! Please upload your new footage and provide instructions.' });
  };
  
  const handleFurtherInstructions = (userInput: string) => {
    // If we just finished a video, and the user gives more instructions
    if (conversationStep === ConversationStep.DONE) {
      addMessage({ role: 'user', content: userInput });
      // Reset relevant details but keep the context of the edited video
      setEditingDetails(prev => ({
        ...prev,
        instructions: userInput, // This is the new instruction
        customDetails: '', // Clear previous custom details
        summaryPlan: null, // Clear old summary
      }));
      // Go back to the confirmation step
      setConversationStep(ConversationStep.AWAITING_CONFIRMATION);
      const summary = {
          Topic: 'Further edits on the previous video.',
          'Your Instructions': `"${userInput}"`,
          'Previous Template': `"${editingDetails.template}"`,
          'Action Plan': 'Apply new edits to the previously generated video.',
      };
      setEditingDetails(prev => ({ ...prev, summaryPlan: summary }));
      addMessage({ 
        role: 'assistant', 
        content: '', 
        type: 'confirmation',
        summaryDetails: summary,
      });

      const timer = setTimeout(() => handleConfirmation(true), 60000);
      setConfirmationTimer(timer);
    }
  };

  const sendMessage = useCallback(async (message: string, file?: File) => {
    setIsLoading(true);
    addMessage({ role: 'user', content: file ? `Uploaded: ${file.name}` : message });
    await simulateThinking();

    switch (conversationStep) {
        case ConversationStep.WELCOME:
        case ConversationStep.AWAITING_VIDEO:
            if (file) {
                setEditingDetails(prev => ({ ...prev, videoFile: file }));
                addMessage({ role: 'assistant', content: `Great, your footage is uploaded. Now, please select an editing style for your video.`, type: 'template-selection' });
                setConversationStep(ConversationStep.AWAITING_TEMPLATE);
            } else {
                setEditingDetails(prev => ({ ...prev, instructions: message }));
                addMessage({ role: 'assistant', content: `Got it. Now please upload the video footage you'd like me to edit.` });
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
                content: '', // Content is now handled by the SummaryCard
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
                resetForNewVideo();
            } else {
                handleFurtherInstructions(message);
            }
            break;

        default:
            addMessage({ role: 'assistant', content: "I'm not sure how to handle that right now. You can try giving me new instructions or uploading a new video." });
            break;
    }
    setIsLoading(false);
  }, [conversationStep, addMessage, editingDetails]);

  const handleTemplateSelection = useCallback(async (template: string) => {
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
  }, [addMessage]);

  const handleConfirmation = useCallback(async (confirmed: boolean, newInstructions?: string) => {
    if (confirmationTimer) {
        clearTimeout(confirmationTimer);
        setConfirmationTimer(null);
    }
    setIsLoading(true);
  
    if (confirmed) {
      addMessage({ role: 'user', content: 'Yes, proceed.' });
      await simulateThinking();
      setConversationStep(ConversationStep.PROCESSING);
      
      const fileToProcess = editingDetails.videoFile;
      const videoUrl = fileToProcess ? URL.createObjectURL(fileToProcess) : null;
      
      const initialState: ProcessingState = {
        videoUrl: videoUrl,
        progress: 0,
        currentStep: 0,
      };
      const processingMessageId = addMessage({ role: 'assistant', content: '', type: 'processing', processingState: initialState });
  
      const interval = setInterval(() => {
        let shouldClear = false;
        setMessages(prevMessages => {
            const updatedMessages = prevMessages.map(msg => {
                if (msg.id === processingMessageId && msg.processingState) {
                    const nextStep = msg.processingState.currentStep + 1;
                    if (nextStep > TOTAL_PROCESSING_STEPS) {
                        shouldClear = true;
                        return {
                            ...msg,
                            processingState: { ...msg.processingState, progress: 100, isCollapsibleOpen: false }
                        };
                    }
                    const newProgress = (nextStep / TOTAL_PROCESSING_STEPS) * 100;
                    return {
                        ...msg,
                        processingState: { ...msg.processingState, progress: newProgress, currentStep: nextStep, isCollapsibleOpen: true }
                    };
                }
                return msg;
            });
            return updatedMessages;
        });

        if (shouldClear) {
            clearInterval(interval);
            setIsLoading(false);
            setEditingDetails(prev => ({...prev, editedVideoUrl: videoUrl }));
            setTimeout(() => {
                setCanvasOpen(true);
            }, 1500);
            setConversationStep(ConversationStep.DONE);
            addMessage({ role: 'assistant', content: 'Your video is ready. Let me know if you would like any changes or want to start a new project.' });
        }
      }, PROCESSING_STEP_DURATION);
  
    } else {
      addMessage({ role: 'user', content: newInstructions || 'No, I have changes.' });
      await simulateThinking();
      addMessage({ role: 'assistant', content: 'No problem. Please provide your updated instructions.' });
      setConversationStep(ConversationStep.AWAITING_INSTRUCTIONS);
      setEditingDetails(prev => ({...prev, summaryPlan: null})); // Clear old summary
      setIsLoading(false);
    }
  }, [addMessage, confirmationTimer, editingDetails.videoFile]);

  useEffect(() => {
    // Start with the welcome message
    if (messages.length === 0) {
      addMessage(initialWelcomeMessage);
    }
  }, [addMessage, messages.length]);

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
