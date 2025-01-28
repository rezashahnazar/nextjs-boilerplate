"use client";

import * as React from "react";
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
import { Button } from "@/components/ui/button";
import { GripVertical, MessageCircle, X } from "lucide-react";
import { Drawer as Sheet } from "vaul";

const DEFAULT_CONFIG = {
  defaultSize: 25,
  minSize: 20,
  maxSize: 40,
};

export function ContextAwareChatBot({
  defaultSize = DEFAULT_CONFIG.defaultSize,
  minSize = DEFAULT_CONFIG.minSize,
  maxSize = DEFAULT_CONFIG.maxSize,
  chatApi = "/api/chat",
  chatBotTitle,
  className,
  children,
}: {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
  chatApi?: string;
  chatBotTitle?: string;
  children: React.ReactNode;
}) {
  const mainContentRef = React.useRef<HTMLDivElement>(null);
  const pageContent = usePageContent(mainContentRef);
  const [bottomSheetOpen, setBottomSheetOpen] = React.useState(false);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className={cn("h-full relative", className)}
    >
      {/* Main Content */}
      <ResizablePanel
        defaultSize={100 - defaultSize}
        minSize={100 - maxSize}
        maxSize={100 - minSize}
        className="h-full w-full"
      >
        <div ref={mainContentRef}>{children}</div>
      </ResizablePanel>

      {/* Resizable Handle (Desktop) */}
      <ResizableHandle
        withHandle
        className="!w-1 bg-border/30 hover:bg-border/50 transition-colors cursor-ew-resize hidden md:flex"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </ResizableHandle>

      {/* Desktop ChatBot Sidebar */}
      <ContextAwareDesktopSidebarChatBot
        pageContent={pageContent}
        chatApi={chatApi}
        chatBotTitle={chatBotTitle}
        defaultSize={defaultSize}
        minSize={minSize}
        maxSize={maxSize}
      />

      {/* Mobile FAB + ChatBot Bottom Sheet  */}
      <ContextAwareMobileBottomSheetChatBot
        pageContent={pageContent}
        chatApi={chatApi}
        chatBotTitle={chatBotTitle}
        bottomSheetOpen={bottomSheetOpen}
        setBottomSheetOpen={setBottomSheetOpen}
      />
    </ResizablePanelGroup>
  );
}

const ContextAwareDesktopSidebarChatBot = ({
  chatApi,
  chatBotTitle,
  pageContent,
  defaultSize,
  minSize,
  maxSize,
}: {
  pageContent: string;
  chatApi: string;
  chatBotTitle?: string;
  defaultSize: number;
  minSize: number;
  maxSize: number;
}) => (
  <ResizablePanel
    defaultSize={defaultSize}
    minSize={minSize}
    maxSize={maxSize}
    className="hidden bg-background relative md:flex flex-col justify-between h-full"
  >
    {/* Header */}
    {chatBotTitle && (
      <div className="px-4 min-h-[50px] h-[50px] border-b bg-background z-10 flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">
          {chatBotTitle}
        </h2>
      </div>
    )}

    {/* ChatBot Content */}
    <AiChatProvider api={chatApi} pageContent={pageContent}>
      <MessageList className="h-full" />
      <ChatInput />
    </AiChatProvider>
  </ResizablePanel>
);

const ContextAwareMobileBottomSheetChatBot = ({
  chatApi,
  pageContent,
  chatBotTitle,
  bottomSheetOpen,
  setBottomSheetOpen,
}: {
  chatApi: string;
  pageContent: string;
  chatBotTitle?: string;
  bottomSheetOpen: boolean;
  setBottomSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <Sheet.Root
    open={bottomSheetOpen}
    onOpenChange={setBottomSheetOpen}
    modal={true}
    direction="bottom"
    dismissible={false}
  >
    {/* Floating Button */}
    <Sheet.Trigger asChild>
      <Button
        variant="link"
        size="default"
        className=" bottom-4 right-4 !size-14 rounded-full shadow-lg md:hidden z-50 fixed bg-background"
        onClick={() => setBottomSheetOpen(true)}
      >
        <MessageCircle className="!size-8" />
      </Button>
    </Sheet.Trigger>

    <Sheet.Portal>
      {/* Overlay */}
      <Sheet.Overlay
        className={cn(
          "fixed inset-0 bg-black/80 !z-[100] md:hidden",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        )}
      />

      {/* Content */}
      <Sheet.Content
        className={cn(
          "bg-background fixed bottom-0 left-0 right-0 !z-[200] md:hidden",
          "h-[90dvh] flex flex-col rounded-t-2xl !overflow-hidden",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          "duration-300"
        )}
      >
        {/* Title */}
        <Sheet.Title className="sr-only">AI ChatBot</Sheet.Title>

        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          {/* Title */}
          <h2 className="text-base font-medium text-muted-foreground">
            {chatBotTitle}
          </h2>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setBottomSheetOpen(false)}
            className="size-8"
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* ChatBot Content */}
        <AiChatProvider api={chatApi} pageContent={pageContent}>
          <MessageList />
          <ChatInput />
        </AiChatProvider>
      </Sheet.Content>
    </Sheet.Portal>
  </Sheet.Root>
);
