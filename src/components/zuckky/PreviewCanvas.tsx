'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Download, PlayCircle } from 'lucide-react';
import React from 'react';

interface PreviewCanvasProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  videoUrl: string | null;
}

export default function PreviewCanvas({ isOpen, onOpenChange, videoUrl }: PreviewCanvasProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full flex flex-col">
        <SheetHeader>
          <SheetTitle>Preview Canvas</SheetTitle>
          <SheetDescription>
            Your edited video is ready. Review it here and download when you're satisfied.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 flex items-center justify-center bg-card/50 rounded-lg my-4">
          {videoUrl ? (
            <video src={videoUrl} controls className="w-full h-auto max-h-[70vh] rounded-md" />
          ) : (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <PlayCircle className="size-16" />
                <p>Video preview will appear here.</p>
            </div>
          )}
        </div>
        <SheetFooter>
          <Button disabled={!videoUrl} className="w-full" size="lg">
            <Download className="mr-2 h-5 w-5" />
            Download Video
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
