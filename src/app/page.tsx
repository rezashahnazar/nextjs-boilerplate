import dynamic from "next/dynamic";

const AiChatProvider = dynamic(
  () =>
    import("@/components/ai-ui/ai-chat-provider").then(
      (mod) => mod.AiChatProvider
    ),
  {
    ssr: true,
  }
);
const MessageList = dynamic(
  () =>
    import("@/components/ai-ui/message-list").then((mod) => mod.MessageList),
  {
    ssr: true,
  }
);
const ChatInput = dynamic(
  () => import("@/components/ai-ui/chat-input").then((mod) => mod.ChatInput),
  {
    ssr: true,
  }
);

export default function Home() {
  return (
    <div className="flex flex-col w-full h-[calc(100dvh-48px)] md:h-[calc(100dvh-64px)]">
      <AiChatProvider api="/api/chat">
        <MessageList />
        <ChatInput />
      </AiChatProvider>
    </div>
  );
}
