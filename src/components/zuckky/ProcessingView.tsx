'use client';

import React, { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Loader, Film } from 'lucide-react';

const processingSteps = [
  'Initializing edit session',
  'Analyzing footage',
  'Applying style template',
  'Performing speech analysis',
  'Silencing gaps & removing fillers',
  'Generating dynamic captions',
  'Adding B-roll & overlays',
  'Color grading & correction',
  'Mastering audio',
  'Rendering final video',
];

export default function ProcessingView() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentStep < processingSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setProgress(((currentStep + 1) / processingSteps.length) * 100);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <Card className="w-full max-w-md bg-card/50 shadow-inner">
        <CardContent className="p-4">
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="py-2 font-semibold hover:no-underline">
                <div className="flex w-full items-center gap-4">
                    <div className="relative">
                        <Film className="size-10 text-muted-foreground" />
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                            {progress < 100 ? (
                                <Loader className="size-4 animate-spin text-primary" />
                            ) : (
                                <CheckCircle2 className="size-4 text-green-500" />
                            )}
                        </div>
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-sm">Editing in progress...</p>
                        <Progress value={progress} className="mt-1 h-2" />
                    </div>
                </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                <div className="space-y-2 pl-4 border-l-2 border-border ml-[1.1rem]">
                    {processingSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                        {index < currentStep ? (
                        <CheckCircle2 className="size-4 text-green-500" />
                        ) : index === currentStep ? (
                        <Loader className="size-4 animate-spin text-primary" />
                        ) : (
                        <div className="size-4 rounded-full border-2 border-muted-foreground" />
                        )}
                        <span className={index >= currentStep ? 'text-muted-foreground' : 'text-foreground'}>
                        {step}
                        </span>
                    </div>
                    ))}
                </div>
                </AccordionContent>
            </AccordionItem>
            </Accordion>
        </CardContent>
    </Card>
  );
}

// Minimal Card components to avoid full import if not needed elsewhere
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  />
))
Card.displayName = "Card"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))
CardContent.displayName = "CardContent"
