'use client';

import React, { DragEvent, useRef, useState, useEffect } from 'react';
import { useConversation } from '@/hooks/use-conversation';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';
import PreviewCanvas from './PreviewCanvas';
import { Button } from '../ui/button';
import { ArrowDown, Film, MessageSquare, Zap } from 'lucide-react';
import Logo from './Logo';

export default function ChatInterface() {
  const {
    messages,
    sendMessage,
    isLoading,
    isCanvasOpen,
    setCanvasOpen,
    editedVideoUrl,
    conversationStep,
    handleTemplateSelection,
    handleConfirmation,
  } = useConversation();

  const [isDragging, setIsDragging] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.relatedTarget && (e.currentTarget as any).contains(e.relatedTarget as Node)) {
        return;
    }
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      sendMessage(`Uploading footage: ${file.name}`, file);
    }
  };
  
  const scrollToBottom = () => {
    scrollAreaRef.current?.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    const scrollDiv = scrollAreaRef.current;
    const handleScroll = () => {
      if (scrollDiv) {
        const isScrolledUp = scrollDiv.scrollTop < scrollDiv.scrollHeight - scrollDiv.clientHeight - 100;
        setShowScrollDown(isScrolledUp);
      }
    };

    if (scrollDiv) {
        scrollDiv.addEventListener('scroll', handleScroll);
    }
    return () => {
        if (scrollDiv) {
            scrollDiv.removeEventListener('scroll', handleScroll);
        }
    };
  }, [messages]);

  const SuggestionPill = ({ icon, text, onClick }: { icon: React.ReactNode, text: string, onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left text-sm transition-colors hover:bg-accent/50"
    >
      <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
      <span className="font-medium text-foreground">{text}</span>
    </button>
  );
  
  return (
    <div className="flex h-full w-full flex-col items-center overflow-hidden" onDragEnter={handleDragEnter}>
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl px-4">
            <div className="w-full text-center">
              <div className="flex justify-center mb-4">
                <Logo className="w-10 h-10" />
              </div>
                <h1 className="text-4xl font-bold tracking-tight">Welcome to Zuckky AI</h1>
                <p className="mb-8 mt-2 text-lg text-muted-foreground">Start editing by giving an instruction or uploading footage.</p>
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <SuggestionPill icon={<MessageSquare />} text="What styles of videos can you edit?" onClick={() => sendMessage("What styles of videos can you edit?")} />
                    <SuggestionPill icon={<Film />} text="Turn this into a viral short-form clip" onClick={() => sendMessage("Turn this into a viral short-form clip")} />
                    <SuggestionPill icon={<Zap />} text="Make this video more engaging" onClick={() => sendMessage("Make this video more engaging")} />
                </div>
            </div>
          </div>
        ) : (
            <div className='w-full max-w-3xl flex-1 flex flex-col overflow-hidden'>
                <div
                    ref={scrollAreaRef}
                    className="w-full flex-1 overflow-y-auto"
                >
                    <ChatMessages
                    messages={messages}
                    conversationStep={conversationStep}
                    onTemplateSelect={handleTemplateSelection}
                    onConfirm={handleConfirmation}
                    />
                </div>
            </div>
        )}
        <div className="w-full flex justify-center sticky bottom-0 bg-background/80 backdrop-blur-sm">
            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
        </div>

      {showScrollDown && (
          <Button
            size="icon"
            variant="outline"
            className="absolute bottom-24 right-6 z-10 h-10 w-10 rounded-full"
            onClick={scrollToBottom}
          >
            <ArrowDown className="h-5 w-5" />
          </Button>
        )}

      {isDragging && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary bg-primary/10 p-16 text-center">
            <Film className="mb-4 h-16 w-16 text-primary" />
            <p className="text-xl font-semibold text-primary">Drop your video file here</p>
            <p className="text-muted-foreground">Only video files are accepted</p>
          </div>
        </div>
      )}

      <PreviewCanvas
        isOpen={isCanvasOpen}
        onOpenChange={setCanvasOpen}
        videoUrl={editedVideoUrl}
      />
    </div>
  );
}
