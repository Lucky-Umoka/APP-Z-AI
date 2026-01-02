
'use client';

import { useConversation } from '@/hooks/use-conversation';
import ChatInput from '@/components/zuckky/ChatInput';
import ChatMessages from '@/components/zuckky/ChatMessages';
import { ZuckkySidebar } from '@/components/zuckky/ZuckkySidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Film, MessageSquare, Zap } from 'lucide-react';
import PreviewCanvas from '@/components/zuckky/PreviewCanvas';
import { DragEvent, useState } from 'react';

const SuggestionPill = ({ icon, text, onClick }: { icon: React.ReactNode; text: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left text-sm transition-colors hover:bg-accent/50"
  >
    <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
    <span className="font-medium text-foreground">{text}</span>
  </button>
);

const Welcome = () => {
    const { sendMessage } = useConversation();
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl text-center px-6">
            <h1 className="text-4xl font-bold tracking-tight">Welcome to Zuckky AI</h1>
            <p className="mb-8 mt-2 text-lg text-muted-foreground">Start editing by giving an instruction or uploading footage.</p>
            <div className="mx-auto grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SuggestionPill icon={<MessageSquare />} text="What styles of videos can you edit?" onClick={() => sendMessage("What styles of videos can you edit?")} />
                <SuggestionPill icon={<Film />} text="Turn this into a viral short-form clip" onClick={() => sendMessage("Turn this into a viral short-form clip")} />
                <SuggestionPill icon={<Zap />} text="Make this video more engaging" onClick={() => sendMessage("Make this video more engaging")} />
            </div>
        </div>
    )
};


export default function Home() {
    const {
        messages,
        sendMessage,
        isLoading,
        isCanvasOpen,
        setCanvasOpen,
        editedVideoUrl,
        conversationStep,
        handleTemplateSelection,
        handleConfirmation,
      } = useConversation();
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.relatedTarget && (e.currentTarget as any).contains(e.relatedTarget as Node)) {
            return;
        }
        setIsDragging(false);
    };
    
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) {
          sendMessage(`Uploading footage: ${file.name}`, file);
        }
    };


  return (
    <SidebarProvider>
      <div className="flex h-screen w-full" onDragEnter={handleDragEnter}>
        <ZuckkySidebar />
        <main className="flex-1 flex flex-col items-center relative overflow-y-auto">
            <div className="w-full max-w-3xl flex-1">
                {messages.length === 0 ? <Welcome /> : <ChatMessages 
                    messages={messages}
                    conversationStep={conversationStep}
                    onTemplateSelect={handleTemplateSelection}
                    onConfirm={handleConfirmation}
                />}
            </div>
            <div className="sticky bottom-0 w-full max-w-3xl px-4 pb-4 bg-gradient-to-t from-background via-background/80 to-transparent">
                <ChatInput onSendMessage={sendMessage} isLoading={isLoading}/>
            </div>
            {isDragging && (
                <div
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                >
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary bg-primary/10 p-16 text-center">
                    <Film className="mb-4 h-16 w-16 text-primary" />
                    <p className="text-xl font-semibold text-primary">Drop your video file here</p>
                    <p className="text-muted-foreground">Only video files are accepted</p>
                </div>
                </div>
            )}

            <PreviewCanvas
                isOpen={isCanvasOpen}
                onOpenChange={setCanvasOpen}
                videoUrl={editedVideoUrl}
            />
        </main>
      </div>
    </SidebarProvider>
  );
}
