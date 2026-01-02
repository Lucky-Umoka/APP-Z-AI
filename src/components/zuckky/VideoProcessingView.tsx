'use client';

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoProcessingViewProps {
  videoUrl: string | null;
  progress: number;
  currentStep: number;
  onPreviewClick: () => void;
}

const processingSteps = [
  { category: 'Understanding', step: 'Reviewing screenplay examples' },
  { category: 'Planning', step: 'Planning your video' },
  { category: 'Planning', step: 'Choosing the video style' },
  { category: 'Creating', step: 'Creating the script' },
  { category: 'Creating', step: 'Writing captions for your video' },
  { category: 'Creating', step: 'Selecting background music' },
  { category: 'Creating', step: 'Assigning a narrator' },
  { category: 'Creating', step: 'Selecting the visuals' },
];
const TOTAL_STEPS = processingSteps.length;


export default function VideoProcessingView({ videoUrl, progress, currentStep, onPreviewClick }: VideoProcessingViewProps) {
    const isComplete = progress >= 100;
    const imageData = PlaceHolderImages.find(img => img.id === 'user-avatar') || PlaceHolderImages[0];

    const getGroupedSteps = () => {
        const groups: { [key: string]: string[] } = {};
        processingSteps.forEach(s => {
            if (!groups[s.category]) {
                groups[s.category] = [];
            }
            groups[s.category].push(s.step);
        });
        return groups;
    };

    const groupedSteps = getGroupedSteps();
    let stepCounter = 0;

  return (
    <Card className="w-full max-w-2xl bg-card/50 shadow-inner hover:shadow-md transition-shadow duration-300">
      <CardContent className="flex items-center gap-4 p-4">
        {/* Video Thumbnail */}
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

        {/* Middle Section: Progress */}
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
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
            <p className="text-sm text-muted-foreground">
                {isComplete ? 'Your video is ready.' : 'Our Video Agent is working on your video...'}
            </p>
        </div>


        {/* Right Section: Steps */}
        <div className="w-56 shrink-0 space-y-3 text-sm">
            {Object.entries(groupedSteps).map(([category, steps]) => (
                <div key={category}>
                    <p className="mb-1.5 text-xs font-semibold uppercase text-muted-foreground">{category}</p>
                    <div className="space-y-1.5">
                        {steps.map(step => {
                            const stepIndex = stepCounter++;
                            const isStepDone = stepIndex < currentStep;
                            const isStepCurrent = stepIndex === currentStep && !isComplete;
                            return (
                                <div key={step} className="flex items-center gap-2">
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
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
