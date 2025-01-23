import { ChatService, Message } from "@/services/chat";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: Message[] };
  return ChatService.streamDataResponse(messages);
}
