import { ContextAwareChatBot } from "@/components/ai-ui/context-aware-chatbot";
import { MainContent } from "@/components/home/main-content";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-[calc(100dvh-48px)] md:h-[calc(100dvh-64px)]">
      <ContextAwareChatBot
        chatBotTitle="چت با هوش مصنوعی درباره من"
        chatApi="/api/chat"
      >
        <MainContent />
      </ContextAwareChatBot>
    </div>
  );
}
