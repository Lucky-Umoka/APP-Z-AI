'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface VideoProcessingViewProps {
  videoUrl: string | null;
  progress: number;
  currentStep: number;
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

export default function VideoProcessingView({ videoUrl, progress, currentStep, onPreviewClick }: VideoProcessingViewProps) {
    const isComplete = progress >= 100;
    const imageData = PlaceHolderImages.find(img => img.id === 'user-avatar') || PlaceHolderImages[0];
    const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="w-full max-w-2xl bg-card/50 shadow-inner hover:shadow-md transition-shadow duration-300">
        <Accordion type="single" collapsible value={isOpen ? "item-1" : ""} onValueChange={(value) => setIsOpen(!!value)}>
            <AccordionItem value="item-1" className="border-none">
                <CardContent className="flex items-center gap-4 p-4">
                    {/* Left Section: Progress */}
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="relative h-16 w-16">
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
                                {isComplete ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : `${Math.round(progress)}%`}
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Main Text & Trigger */}
                    <div className="flex-1">
                         <AccordionTrigger className="p-0 hover:no-underline w-full">
                            <div className='text-left'>
                                <p className="text-base font-medium">
                                    {isComplete ? 'Your video is ready.' : 'Our Video Agent is working on your video...'}
                                </p>
                                <p className="text-sm text-muted-foreground">Click to {isOpen ? 'hide' : 'show'} details</p>
                            </div>
                        </AccordionTrigger>
                    </div>

                    {/* Right Section: Thumbnail */}
                    <button 
                        onClick={onPreviewClick}
                        className="relative h-28 w-20 shrink-0 cursor-pointer overflow-hidden rounded-md transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                        disabled={!isComplete}
                        aria-label="Open video preview"
                    >
                    <Image
                        src={videoUrl || imageData.imageUrl}
                        alt="Video thumbnail"
                        layout="fill"
                        className="object-cover"
                    />
                    {isComplete && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <CheckCircle2 className="h-8 w-8 text-white" />
                        </div>
                    )}
                    </button>
                </CardContent>
                
                <AccordionContent className="px-4 pb-4">
                  <div className="ml-24 space-y-2 border-l pl-6">
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
