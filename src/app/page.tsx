import dynamic from "next/dynamic";
const ContextAwareChatBot = dynamic(
  () =>
    import("@/components/ai-ui/context-aware-chatbot").then(
      (mod) => mod.ContextAwareChatBot
    ),
  { ssr: true }
);
const MainContent = dynamic(
  () => import("@/components/home/main-content").then((mod) => mod.MainContent),
  { ssr: true }
);

export default function Home() {
  return (
    <div className="flex flex-col h-[calc(100vh-48px)] md:h-[calc(100vh-64px)]">
      <ContextAwareChatBot
        chatBotTitle="چت با هوش مصنوعی درباره من"
        chatApi="/api/chat"
      >
        <MainContent />
      </ContextAwareChatBot>
    </div>
  );
}
