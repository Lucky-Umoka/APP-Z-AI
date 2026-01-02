import ChatInterface from '@/components/zuckky/ChatInterface';
import { ZuckkySidebar } from '@/components/zuckky/ZuckkySidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <ZuckkySidebar />
        <SidebarInset>
          <main className="flex-1 flex justify-center">
            <ChatInterface />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}