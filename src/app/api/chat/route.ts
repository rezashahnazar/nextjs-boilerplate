import { ChatService } from "@/services/chat";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  return ChatService.streamDataResponse(messages, {
    provider: "openai",
    model: "gpt-4o-mini",
    streamFn: "streamText",
  });
}
