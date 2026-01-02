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

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    // Auto-resize textarea
    event.target.style.height = 'auto';
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const handleSendMessage = () => {
    if (isLoading || !message.trim()) return;
    onSendMessage(message.trim());
    setMessage('');
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
      <div className="relative p-4 pb-2">
        <div className="relative rounded-2xl p-[2px] focus-within:[&>div]:hidden focus-within:bg-[conic-gradient(from_var(--angle),_transparent_0%,_var(--zuckky-green)_50%,_transparent_100%)] focus-within:[animation:border-flow_3s_linear_infinite]">
          <div className="absolute inset-0 rounded-2xl border border-border"></div>
          <div className="relative flex min-h-[52px] w-full items-center rounded-[14px] bg-input pl-4">
            <Textarea
              placeholder="Give me instructions for your video..."
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              rows={1}
              className="h-auto max-h-48 flex-1 resize-none self-center border-none bg-transparent py-2.5 text-base shadow-none ring-offset-transparent placeholder:text-muted-foreground/80 focus-visible:ring-0"
              disabled={isLoading}
            />
            <div className="flex items-center gap-1 self-end p-2">
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
