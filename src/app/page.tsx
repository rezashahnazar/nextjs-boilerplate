import { ResizableChatSidebar } from "@/components/chat/resizable-chat-sidebar";
import { MainContent } from "@/components/home/main-content";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-[calc(100dvh-48px)] md:h-[calc(100dvh-64px)]">
      <ResizableChatSidebar>
        <MainContent />
      </ResizableChatSidebar>
    </div>
  );
}
