
'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, Loader, PlayCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ProcessingState } from '@/lib/types';

interface VideoProcessingViewProps extends ProcessingState {
  onPreviewClick: () => void;
}

const processingSteps = [
    'Reviewing screenplay examples',
    'Planning your video',
    'Choosing the video style',
    'Creating the script',
    'Writing captions for your video',
    'Selecting background music',
    'Assigning a narrator',
    'Selecting the visuals',
];

const CompletedIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="8" fill="#10B981"/>
        <path d="M5 8.5L7.5 11L11.5 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const InProgressIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
        <path d="M8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5898 4.41015 14.5 8 14.5C11.5898 14.5 14.5 11.5898 14.5 8" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

const PendingIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="7.5" stroke="#4B5563"/>
    </svg>
);


export default function VideoProcessingView({ 
    progress, 
    currentStep,
    onPreviewClick,
    isCollapsibleOpen: isCollapsibleOpenProp = true
}: VideoProcessingViewProps) {
    const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(isCollapsibleOpenProp);
    const isComplete = progress >= 100;

    useEffect(() => {
        setIsCollapsibleOpen(isCollapsibleOpenProp);
    }, [isCollapsibleOpenProp]);

  return (
    <Card className="w-full max-w-2xl bg-card/50 shadow-inner hover:shadow-md transition-shadow duration-300">
        <Accordion 
            type="single" 
            collapsible 
            value={isCollapsibleOpen ? "item-1" : ""} 
            onValueChange={(value) => setIsCollapsibleOpen(!!value)}
        >
            <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="p-4 hover:no-underline w-full justify-start text-sm text-muted-foreground data-[state=open]:border-b data-[state=open]:border-border">
                    <div className="flex items-center gap-4 w-full">
                        {/* Left Section: Progress */}
                        <div className="flex flex-col items-center justify-center gap-2">
                            <div className="relative h-12 w-12">
                                <svg className="h-full w-full" viewBox="0 0 36 36">
                                    <path
                                        className="stroke-muted/30"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        strokeWidth="3"
                                    />
                                    <path
                                        className="stroke-primary transition-all duration-500"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        strokeWidth="3"
                                        strokeDasharray={`${progress}, 100`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground">
                                    {isComplete ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : `${Math.round(progress)}%`}
                                </div>
                            </div>
                        </div>

                        {/* Middle Section: Main Text */}
                        <div className="flex-1 text-left">
                            <p className="text-base font-medium text-foreground">
                                {isComplete ? 'Your video is ready.' : 'Our Video Agent is working on your video...'}
                            </p>
                            <span className="text-sm text-muted-foreground mt-1">Reasoning</span>
                        </div>

                        {/* Right Section: Thumbnail */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isComplete) onPreviewClick();
                            }}
                            className={cn(
                                "relative h-16 w-28 shrink-0 flex items-center justify-center bg-black/80 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                                isComplete ? "cursor-pointer hover:scale-[1.02]" : "cursor-default"
                            )}
                            disabled={!isComplete}
                            aria-label="Open video preview"
                        >
                            <PlayCircle className={cn("size-8 text-white/50 transition-colors", isComplete && "text-white")}/>
                        </button>
                    </div>
                </AccordionTrigger>
                
                <AccordionContent className="px-4 pb-4">
                  <div className="ml-16 space-y-2.5 border-l border-muted/30 pl-8">
                      {processingSteps.map((step, stepIndex) => {
                          const isStepDone = stepIndex < currentStep;
                          const isStepCurrent = stepIndex === currentStep && !isComplete;
                          return (
                              <div key={step} className="flex items-center gap-3 text-sm">
                                  <div className="shrink-0">
                                    {isStepDone || isComplete ? (
                                        <CompletedIcon />
                                    ) : isStepCurrent ? (
                                        <InProgressIcon />
                                    ) : (
                                        <PendingIcon />
                                    )}
                                  </div>
                                  <span className={cn('truncate', 
                                    isStepCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                                  )}>
                                      {step}
                                  </span>
                              </div>
                          );
                      })}
                  </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </Card>
  );
}
