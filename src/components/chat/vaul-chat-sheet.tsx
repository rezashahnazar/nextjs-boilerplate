"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Drawer as Sheet } from "vaul";
import { AiChatProvider } from "@/components/ai-ui/ai-chat-provider";
import { MessageList } from "@/components/ai-ui/message-list";
import { ChatInput } from "@/components/ai-ui/chat-input";

interface VaulChatSheetProps {
  pageContent?: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  showFloatingButton?: boolean;
}

export function VaulChatSheet({
  pageContent,
  children,
  defaultOpen = false,
  showFloatingButton = true,
}: VaulChatSheetProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Sheet.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      modal={true}
      direction="bottom"
      dismissible={true}
    >
      {children ? (
        <div onClick={() => setIsOpen(true)} className="cursor-pointer">
          {children}
        </div>
      ) : showFloatingButton ? (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg md:hidden z-50 hover:scale-105 transition-transform"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : null}

      <Sheet.Portal>
        <Sheet.Overlay
          className={cn(
            "fixed inset-0 bg-black/80 !z-[100] md:hidden",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <Sheet.Content
          className={cn(
            "bg-background fixed bottom-0 left-0 right-0 !z-[200] md:hidden",
            "h-[90dvh] flex flex-col rounded-t-2xl !overflow-hidden",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            "duration-300"
          )}
        >
          <Sheet.Title className="sr-only">Chat</Sheet.Title>
          <Sheet.Handle className="h-7 mt-4 w-full flex items-center justify-center cursor-grab active:cursor-grabbing bg-background border-b rounded-t-[10px]" />

          <div className="flex-1 overflow-hidden">
            <AiChatProvider api="/api/chat" pageContent={pageContent}>
              <MessageList />
              <ChatInput />
            </AiChatProvider>
          </div>
        </Sheet.Content>
      </Sheet.Portal>
    </Sheet.Root>
  );
}
