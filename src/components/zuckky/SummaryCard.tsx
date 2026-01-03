'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SummaryDetails } from '@/lib/types';

interface SummaryCardProps {
  summary: SummaryDetails;
}

export default function SummaryCard({ summary }: SummaryCardProps) {
    const summaryEntries = Object.entries(summary);

  return (
    <Card className="w-full max-w-2xl bg-card/50 shadow-inner hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Great! Here is a plan for your video based on your request:
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {summaryEntries.map(([key, value], index) => (
          <React.Fragment key={key}>
            <div className="flex justify-between items-center py-2">
              <p className="text-muted-foreground w-1/3">{key}</p>
              <Separator orientation="vertical" className="h-6 mx-4" />
              <p className="text-right text-foreground flex-1">{value}</p>
            </div>
            {index < summaryEntries.length - 1 && <Separator className="bg-border/50" />}
          </React.Fragment>
        ))}
        <div className="pt-4 text-center text-xs text-muted-foreground">
            I'll start automatically in 60 seconds if you don't respond. Respond with YES to confirm.
        </div>
      </CardContent>
    </Card>
  );
}
