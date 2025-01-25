"use client";

import * as React from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { AiChatProvider } from "@/components/ai-ui/ai-chat-provider";
import { MessageList } from "@/components/ai-ui/message-list";
import { ChatInput } from "@/components/ai-ui/chat-input";
import { usePageContent } from "@/hooks/use-page-content";
import { VaulChatSheet } from "./vaul-chat-sheet";

interface ResizableChatSidebarProps {
  children: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

export function ResizableChatSidebar({
  children,
  defaultSize = 25,
  minSize = 20,
  maxSize = 40,
  className,
}: ResizableChatSidebarProps) {
  const mainContentRef = React.useRef<HTMLDivElement>(null);
  const pageContent = usePageContent(mainContentRef);

  // Mobile view with Vaul Sheet component
  const MobileView = () => (
    <VaulChatSheet pageContent={pageContent} showFloatingButton={false} />
  );

  // Desktop view with ResizablePanel
  const DesktopView = () => (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel
        defaultSize={100 - defaultSize}
        minSize={100 - maxSize}
        maxSize={100 - minSize}
        className="h-full"
      >
        <div ref={mainContentRef}>{children}</div>
      </ResizablePanel>
      <ResizableHandle className="w-2 bg-border/50 hover:bg-border/90 transition-colors">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </ResizableHandle>
      <ResizablePanel
        defaultSize={defaultSize}
        minSize={minSize}
        maxSize={maxSize}
        className="hidden md:block"
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-hidden">
            <AiChatProvider api="/api/chat" pageContent={pageContent}>
              <MessageList />
              <ChatInput />
            </AiChatProvider>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );

  return (
    <div className={cn("h-full", className)}>
      <DesktopView />
      <MobileView />
    </div>
  );
}
