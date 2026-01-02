export type ProcessingState = {
  videoUrl: string | null;
  progress: number;
  currentStep: number;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: React.ReactNode;
  type?: 'text' | 'template-selection' | 'processing' | 'confirmation' | 'final-video' | 'error';
  processingState?: ProcessingState;
};

export enum ConversationStep {
  WELCOME,
  AWAITING_VIDEO,
  AWAITING_TEMPLATE,
  AWAITING_CUSTOM_DETAILS,
  AWAITING_INSTRUCTIONS,
  AWAITING_CONFIRMATION,
  PROCESSING,
  DONE,
}
