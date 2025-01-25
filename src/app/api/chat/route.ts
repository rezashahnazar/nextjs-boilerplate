import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { nanoid } from "nanoid";
import { smoothStream } from "ai";
import { monitorStream } from "@/lib/stream-transformers";
export const runtime = "edge";
export const maxDuration = 30;

const avalAi = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
  compatibility: "strict",
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = streamText({
    model: avalAi("gpt-4o-mini"),
    messages,
    system: "You are a helpful assistant talking in Persian.",
    experimental_generateMessageId: nanoid,
    experimental_toolCallStreaming: true,
    experimental_transform: [smoothStream(), monitorStream()],
  });

  return stream.toDataStreamResponse();
}
