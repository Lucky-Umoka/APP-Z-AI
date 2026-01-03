'use client';

import React from 'react';
import { Message } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent } from '../ui/card';
import VideoProcessingView from './VideoProcessingView';
import TemplateSelector from './TemplateSelector';
import SummaryCard from './SummaryCard';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { ThumbsUp, ThumbsDown, FileVideo } from 'lucide-react';
import Logo from './Logo';

interface ChatMessagesProps {
  messages: Message[];
  conversationStep: any;
  onTemplateSelect: (template: string) => void;
  onConfirm: (confirmed: boolean) => void;
  onPreviewClick: () => void;
}

const UserMessageAttachments = ({ attachments }: { attachments: File[] }) => {
    if (!attachments || attachments.length === 0) return null;
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 border-b border-green-500/20">
        {attachments.map((file, index) => (
          <div key={index} className="relative flex items-center gap-3 p-2 rounded-lg bg-background/50 w-fit">
            <FileVideo className="h-6 w-6 text-muted-foreground" />
            <div className="text-sm overflow-hidden">
              <div className="font-medium truncate max-w-[100px]">{file.name}</div>
              <div className="text-muted-foreground text-xs">{Math.round(file.size / 1024)} KB</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

export default function ChatMessages({ messages, conversationStep, onTemplateSelect, onConfirm, onPreviewClick }: ChatMessagesProps) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 pb-12 pt-12">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={cn('flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300', message.role === 'user' ? 'justify-end' : 'justify-start')}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {message.role === 'assistant' && (
            <Avatar className="h-8 w-8 border-none bg-transparent flex items-center justify-center">
               <Logo className="h-full w-full" />
            </Avatar>
          )}

          <div className={cn('flex max-w-[85%] flex-col gap-2', message.role === 'user' ? 'items-end' : 'items-start')}>
            {message.role === 'assistant' ? (
              <>
                {message.type === 'processing' && message.processingState ? (
                   <VideoProcessingView 
                    {...message.processingState}
                    onPreviewClick={onPreviewClick}
                   />
                ) : message.type === 'confirmation' && message.summaryDetails ? (
                    <SummaryCard summary={message.summaryDetails} />
                ) : (
                    <div className="p-4 text-base bg-transparent border-none">{message.content}</div>
                )}

                {index === messages.length - 1 && (
                    <>
                        {message.type === 'template-selection' && (
                            <TemplateSelector onSelect={onTemplateSelect} />
                        )}
                        {message.type === 'confirmation' && (
                        <div className="flex gap-2">
                            <Button onClick={() => onConfirm(true)} variant="outline" size="sm">
                            Yes, proceed
                            </Button>
                            <Button onClick={() => onConfirm(false)} variant="outline" size="sm">
                            No, I have changes
                            </Button>
                        </div>
                        )}
                    </>
                )}
                 {message.type === 'final-video' && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Was this helpful?</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-accent/50 hover:text-green-500">
                        <ThumbsUp className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-accent/50 hover:text-red-500">
                        <ThumbsDown className="size-4" />
                        </Button>
                    </div>
                )}
              </>
            ) : ( // User message
                <Card
                    className='rounded-2xl transition-all duration-200 hover:shadow-md rounded-br-none border border-green-500/20 bg-green-500/10 text-foreground overflow-hidden'
                >
                    <UserMessageAttachments attachments={message.attachments || []} />
                    {message.content && (
                       <CardContent className="p-4 text-base">{message.content}</CardContent>
                    )}
                </Card>
            )}
          </div>
          {message.role === 'user' && (
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://picsum.photos/seed/user-avatar/40/40" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
    </div>
  );
}
