'use client';

import React from 'react';
import { Separator } from '@/components/ui/separator';
import { SummaryDetails } from '@/lib/types';
import { CardTitle, CardHeader } from '../ui/card';

interface SummaryCardProps {
  summary: SummaryDetails;
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  const summaryEntries = Object.entries(summary);

  return (
    <div className="w-full max-w-2xl bg-transparent transition-shadow duration-300">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg font-medium">
          Great! Here is a plan for your video based on your request:
        </CardTitle>
      </CardHeader>
      <div className="space-y-4 text-sm mt-4">
        {summaryEntries.map(([key, value], index) => (
          <React.Fragment key={key}>
            <div className="flex items-start py-2">
              <p className="text-muted-foreground w-1/3 shrink-0">{key}</p>
              <p className="text-left text-foreground flex-1 border-l border-border pl-4">{String(value)}</p>
            </div>
            {index < summaryEntries.length - 1 && <Separator className="bg-border/50" />}
          </React.Fragment>
        ))}
        <div className="pt-4 text-center text-xs text-muted-foreground">
            I'll start automatically in 60 seconds if you don't respond. Respond with YES to confirm.
        </div>
      </div>
    </div>
  );
}
