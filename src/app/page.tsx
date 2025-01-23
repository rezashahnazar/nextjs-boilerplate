import { ChatUI } from "@/components/ai-ui/compositions/Chat";

export default function Home() {
  return (
    <div className="w-full h-[calc(100dvh-64px)] overflow-hidden">
      <ChatUI bottomMessage="پاسخ هوش مصنوعی ممکن است اشتباه باشد." />
    </div>
  );
}
