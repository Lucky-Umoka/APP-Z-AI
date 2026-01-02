'use client';

import React from 'react';
import { Message } from '@/lib/types';
import Logo from './Logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent } from '../ui/card';
import ProcessingView from './ProcessingView';
import TemplateSelector from './TemplateSelector';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  conversationStep: any; // Using any to avoid breaking changes for now
  onTemplateSelect: (template: string) => void;
  onConfirm: (confirmed: boolean) => void;
}

export default function ChatMessages({ messages, conversationStep, onTemplateSelect, onConfirm }: ChatMessagesProps) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 pb-12 pt-12">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={cn('flex items-start gap-4', message.role === 'user' ? 'justify-end' : 'justify-start')}
        >
          {message.role === 'assistant' && (
            <Avatar className="h-8 w-8 border border-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/50 text-primary">
                <Logo className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          )}

          <div className={cn('flex max-w-[80%] flex-col gap-2', message.role === 'user' ? 'items-end' : 'items-start')}>
            <Card
              className={cn(
                'rounded-2xl',
                message.role === 'user'
                  ? 'rounded-br-none bg-primary text-primary-foreground'
                  : 'rounded-bl-none bg-card'
              )}
            >
              <CardContent className="p-4 text-base">{message.content}</CardContent>
            </Card>

            {/* Render interactive components for the last assistant message */}
            {message.role === 'assistant' && index === messages.length - 1 && (
              <>
                {message.type === 'template-selection' && (
                  <TemplateSelector onSelect={onTemplateSelect} />
                )}
                {message.type === 'processing' && (
                  <ProcessingView />
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
