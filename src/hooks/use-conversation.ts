'use client';

import { useState, useCallback, useEffect } from 'react';
import { Message, ConversationStep, ProcessingState } from '@/lib/types';
import { postToMakeWebhook } from '@/lib/actions';

let messageIdCounter = 0;
const getUniqueId = () => `msg_${Date.now()}_${messageIdCounter++}`;

const initialWelcomeMessage: Message = {
  id: getUniqueId(),
  role: 'assistant',
  content: "Hi, I'm Zuckky AI, here to help you edit your videos to go viral. To get started, please upload your footage by clicking the paperclip icon or dragging a video file into the chat.",
  type: 'text'
};

const PROCESSING_STEP_DURATION = 1500;
const TOTAL_PROCESSING_STEPS = 8;

export function useConversation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationStep, setConversationStep] = useState<ConversationStep>(ConversationStep.WELCOME);
  const [isLoading, setIsLoading] = useState(false);
  const [editingDetails, setEditingDetails] = useState({
    videoUrl: null as string | null,
    template: '',
    customDetails: '',
    instructions: ''
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

  const handleStepLogic = async (userInput: string, file?: File) => {
    await postToMakeWebhook({ step: conversationStep, input: userInput, fileName: file?.name });
    await simulateThinking();

    switch (conversationStep) {
      case ConversationStep.WELCOME:
        if (file) {
          const videoUrl = URL.createObjectURL(file);
          setEditingDetails(prev => ({ ...prev, videoUrl }));
          addMessage({ role: 'assistant', content: `Great, your footage is uploaded. Now, please select an editing style for your video.`, type: 'template-selection' });
          setConversationStep(ConversationStep.AWAITING_TEMPLATE);
        } else {
          addMessage({ role: 'assistant', content: initialWelcomeMessage.content });
        }
        break;

      case ConversationStep.AWAITING_TEMPLATE:
        addMessage({ role: 'assistant', content: 'Please select one of the templates to continue.' });
        break;

      case ConversationStep.AWAITING_CUSTOM_DETAILS:
        setEditingDetails(prev => ({ ...prev, customDetails: userInput }));
        addMessage({ role: 'assistant', content: "Thanks. Any other special instructions for editing?", type: 'text' });
        setConversationStep(ConversationStep.AWAITING_INSTRUCTIONS);
        break;

      case ConversationStep.AWAITING_INSTRUCTIONS:
        setEditingDetails(prev => ({ ...prev, instructions: userInput }));
        setConversationStep(ConversationStep.AWAITING_CONFIRMATION);
        const summary = `I will edit your video using the "${editingDetails.template}" style. Key instructions: "${userInput}". ${editingDetails.customDetails ? `Custom details: "${editingDetails.customDetails}".` : ''} \n\nIs this correct? I'll start automatically in 60 seconds if you don't respond.`;
        addMessage({ role: 'assistant', content: summary, type: 'confirmation' });
        const timer = setTimeout(() => handleConfirmation(true), 60000);
        setConfirmationTimer(timer);
        break;

        case ConversationStep.AWAITING_CONFIRMATION:
            if (userInput.toLowerCase().trim() === 'yes') {
                handleConfirmation(true);
            } else {
                handleConfirmation(false, userInput);
            }
            break;

      default:
        addMessage({ role: 'assistant', content: "I'm not sure how to handle that right now. You can try giving me new instructions or uploading a new video." });
    }
  };

  const sendMessage = useCallback(async (message: string, file?: File) => {
    setIsLoading(true);
    addMessage({ role: 'user', content: file ? `Uploaded: ${file.name}` : message });
    await handleStepLogic(message, file);
    setIsLoading(false);
  }, [conversationStep, addMessage]);

  const handleTemplateSelection = useCallback(async (template: string) => {
    setIsLoading(true);
    addMessage({ role: 'user', content: `Selected template: ${template}` });
    setEditingDetails(prev => ({ ...prev, template }));
    await postToMakeWebhook({ step: 'TEMPLATE_SELECTED', template });
    await simulateThinking();

    if (template === 'Custom') {
      addMessage({ role: 'assistant', content: 'Please describe the custom style you want.' });
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
        
        const initialState: ProcessingState = {
            videoUrl: editingDetails.videoUrl,
            progress: 0,
            currentStep: 0,
        };
        const processingMessageId = addMessage({ role: 'assistant', content: '', type: 'processing', processingState: initialState });

        const interval = setInterval(() => {
            setMessages(prevMessages => {
                const currentMessage = prevMessages.find(msg => msg.id === processingMessageId);
                if (currentMessage && currentMessage.processingState) {
                    const nextStep = currentMessage.processingState.currentStep + 1;
                    if (nextStep > TOTAL_PROCESSING_STEPS) {
                        clearInterval(interval);
                        updateMessage(processingMessageId, {
                            processingState: { ...currentMessage.processingState, progress: 100 }
                        });
                        setConversationStep(ConversationStep.DONE);
                        setCanvasOpen(true);
                        setIsLoading(false);
                        return prevMessages;
                    }
                    const newProgress = (nextStep / TOTAL_PROCESSING_STEPS) * 100;
                    const newState: ProcessingState = {
                        ...currentMessage.processingState,
                        progress: newProgress,
                        currentStep: nextStep,
                    };
                    updateMessage(processingMessageId, { processingState: newState });
                }
                return prevMessages;
            });
        }, PROCESSING_STEP_DURATION);
    } else {
        addMessage({ role: 'user', content: newInstructions || 'No, I have changes.' });
        await simulateThinking();
        addMessage({ role: 'assistant', content: 'No problem. Please provide your updated instructions.' });
        setConversationStep(ConversationStep.AWAITING_INSTRUCTIONS);
        setIsLoading(false);
    }
  }, [addMessage, confirmationTimer, editingDetails.videoUrl]);

  return {
    messages,
    sendMessage,
    isLoading,
    isCanvasOpen,
    setCanvasOpen,
    editedVideoUrl: editingDetails.videoUrl,
    conversationStep,
    handleTemplateSelection,
    handleConfirmation,
  };
}
