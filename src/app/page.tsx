import ChatInterface from '@/components/zuckky/ChatInterface';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <main className="flex h-screen w-full flex-col">
        <ChatInterface />
      </main>
    </div>
  );
}
