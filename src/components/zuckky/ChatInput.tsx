'use client';

import { Paperclip, Send, X, FileVideo } from 'lucide-react';
import React, { useRef, ChangeEvent, KeyboardEvent, useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string, file?: File) => void;
  isLoading: boolean;
}

const ChatInput = forwardRef<{ setFile: (file: File) => void }, ChatInputProps>(({ onSendMessage, isLoading }, ref) => {
  const [message, setMessage] = useState('');
  const [file, setFileState] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    setFile: (file: File) => {
      setFileState(file);
    }
  }));

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleSendMessage = () => {
    if (isLoading || (!message.trim() && !file)) return;
    onSendMessage(message.trim(), file || undefined);
    setMessage('');
    setFileState(null);
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
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
        setFileState(selectedFile);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFileState(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
        <div 
          className={cn(
            'relative w-full rounded-2xl p-px transition-all duration-700', 
            'bg-gradient-to-r from-[#58CC02] via-[#00C0FF] to-[#58CC02] bg-[length:200%_200%] bg-center',
            'focus-within:animate-border-flow focus-within:bg-[length:100%_100%]'
          )}
        >
          <div className={cn("relative w-full bg-card rounded-xl")}>
            {file && (
            <div className="p-3 border-b border-border">
                <div className="relative flex items-center gap-3 p-2 rounded-lg bg-background w-fit">
                    <FileVideo className="h-6 w-6 text-muted-foreground" />
                    <div className="text-sm">
                        <div className="font-medium truncate max-w-xs">{file.name}</div>
                        <div className="text-muted-foreground">{Math.round(file.size / 1024)} KB</div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
                        onClick={removeFile}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            )}
            <div className="relative">
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
                        className="text-muted-foreground/90 hover:bg-accent/50 hover:text-foreground transition-all duration-200 hover:scale-105 active:scale-95"
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
                    className="text-muted-foreground/90 hover:bg-accent/50 hover:text-foreground disabled:bg-transparent transition-all duration-200 hover:scale-105 active:scale-95"
                    onClick={handleSendMessage}
                    disabled={isLoading || (!message.trim() && !file)}
                    aria-label="Send Message"
                >
                    <Send className="size-6" />
                </Button>
                </div>
            </div>
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
});

ChatInput.displayName = 'ChatInput';
export default ChatInput;
