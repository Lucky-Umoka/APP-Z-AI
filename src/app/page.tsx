import ChatInterface from '@/components/zuckky/ChatInterface';
import { ZuckkySidebar } from '@/components/zuckky/ZuckkySidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <ZuckkySidebar />
        <main className="flex-1">
          <ChatInterface />
        </main>
      </div>
    </SidebarProvider>
  );
}
