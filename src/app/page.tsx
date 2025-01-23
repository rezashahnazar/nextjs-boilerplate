"use client";

import { MessageList } from "@/components/ai-ui/message-list";
import { ChatInput } from "@/components/ai-ui/chat-input";
import { AiChatProvider } from "@/components/ai-ui/ai-chat-provider";

export default function Home() {
  return (
    <div className="w-full h-[calc(100dvh-64px)] overflow-hidden">
      <AiChatProvider>
        <MessageList />
        <ChatInput bottomMessage="پاسخ هوش مصنوعی ممکن است اشتباه باشد." />
      </AiChatProvider>
    </div>
  );
}
