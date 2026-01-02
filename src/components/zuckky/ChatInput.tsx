'use client';

import { Paperclip, Send } from 'lucide-react';
import React, { useRef, ChangeEvent, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatInputProps {
  onSendMessage: (message: string, file?: File) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = React.useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleSendMessage = () => {
    if (isLoading || !message.trim()) return;
    onSendMessage(message.trim());
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onSendMessage(`Uploading footage: ${file.name}`, file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="p-4 pb-2">
        <div className="relative w-full rounded-2xl p-px bg-border focus-within:bg-[conic-gradient(from_var(--angle),_var(--tw-gradient-stops))] focus-within:animate-border-flow">
          <div className="relative flex w-full flex-col rounded-[15px] bg-background">
            <Textarea
              ref={textareaRef}
              placeholder="Give me instructions for your video..."
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              rows={1}
              className="h-auto max-h-48 min-h-[52px] flex-1 resize-none self-center border-none bg-transparent px-4 py-3.5 text-base shadow-none ring-offset-transparent placeholder:text-muted-foreground/80 focus-visible:ring-0"
              disabled={isLoading}
            />
            <div className="flex items-center justify-between p-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      onClick={handleUploadClick}
                      disabled={isLoading}
                      aria-label="Upload Footage"
                    >
                      <Paperclip className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload footage (video only)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-accent/50 hover:text-foreground disabled:bg-transparent"
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
                aria-label="Send Message"
              >
                <Send className="size-5" />
              </Button>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Zuckky can make mistakes. Consider checking important information.
        </p>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="video/*"
      />
    </div>
  );
}
