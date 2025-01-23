"use client";

import { MessageList } from "@/components/ai-ui/message-list";
import { ChatInput } from "@/components/ai-ui/chat-input";
import { AiChatProvider } from "@/components/ai-ui/ai-chat-provider";

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
