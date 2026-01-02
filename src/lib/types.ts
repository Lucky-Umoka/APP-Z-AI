export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: React.ReactNode;
  type?: 'text' | 'template-selection' | 'processing' | 'confirmation' | 'final-video' | 'error';
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
