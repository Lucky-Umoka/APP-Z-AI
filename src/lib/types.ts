export type ProcessingState = {
  videoUrl: string | null;
  progress: number;
  currentStep: number;
  isCollapsibleOpen?: boolean;
};

export type SummaryDetails = {
    [key: string]: string;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: React.ReactNode;
  type?: 'text' | 'template-selection' | 'processing' | 'confirmation' | 'final-video' | 'error';
  processingState?: ProcessingState;
  summaryDetails?: SummaryDetails;
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

export type EditingDetails = {
    videoFile: File | null;
    trainingFile: File | null;
    template: string;
    customDetails: string;
    instructions: string;
    summaryPlan: SummaryDetails | null;
    editedVideoUrl: string | null;
}
