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
    <div className="w-full">
      <div className="relative w-full rounded-2xl bg-card">
        <Textarea
          ref={textareaRef}
          placeholder="Give me instructions for your video..."
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          rows={1}
          className="h-auto max-h-48 min-h-[52px] w-full resize-none border-none bg-transparent px-12 py-3.5 text-base shadow-none ring-offset-transparent placeholder:text-muted-foreground/80 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-200"
          disabled={isLoading}
        />
        <div className="absolute bottom-3 left-3 flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all duration-200 hover:scale-105 active:scale-95"
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
        </div>
        <div className="absolute bottom-3 right-3 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-accent/50 hover:text-foreground disabled:bg-transparent transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim()}
            aria-label="Send Message"
          >
            <Send className="size-5" />
          </Button>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Zuckky can make mistakes. Consider checking important information.
      </p>
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
