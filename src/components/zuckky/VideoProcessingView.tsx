'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, Loader, PlayCircle } from 'lucide-react';
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
                <div className="flex items-center gap-4 p-4">
                    {/* Left Section: Progress */}
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="relative h-12 w-12">
                            <svg className="h-full w-full" viewBox="0 0 36 36">
                                <path
                                    className="stroke-muted"
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
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                                {isComplete ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : `${Math.round(progress)}%`}
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Main Text & Trigger */}
                    <div className="flex-1">
                        <AccordionTrigger className="p-0 hover:no-underline w-full justify-start gap-2 text-left">
                            <p className="text-base font-medium">
                                {isComplete ? 'Your video is ready.' : 'Our Video Agent is working on your video...'}
                            </p>
                        </AccordionTrigger>
                        <p className="text-sm text-muted-foreground mt-1">Reasoning</p>
                    </div>

                    {/* Right Section: Thumbnail */}
                    <button 
                        onClick={onPreviewClick}
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
                
                <AccordionContent className="px-4 pb-4">
                  <div className="ml-16 space-y-2 border-l pl-8">
                      {processingSteps.map((step, stepIndex) => {
                          const isStepDone = stepIndex < currentStep;
                          const isStepCurrent = stepIndex === currentStep && !isComplete;
                          return (
                              <div key={step} className="flex items-center gap-3 text-sm">
                                  {isStepDone || isComplete ? (
                                      <CheckCircle2 className="size-4 shrink-0 text-green-500" />
                                  ) : isStepCurrent ? (
                                      <Loader className="size-4 shrink-0 animate-spin text-primary" />
                                  ) : (
                                      <Circle className="size-4 shrink-0 text-muted-foreground" />
                                  )}
                                  <span className={cn('truncate', (isStepCurrent || isStepDone || isComplete) ? "text-foreground" : "text-muted-foreground")}>
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