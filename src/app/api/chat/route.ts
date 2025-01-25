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
  const { messages, pageContent = "" } = await req.json();

  const systemMessage = `
You are a helpful assistant talking in Persian.
You have access to the current page content which is:

${pageContent}

When asked about the page content, refer to this information to provide accurate answers.
Always respond in Persian and maintain a friendly, professional tone.
If asked about something not related to the page content, you can still help with general questions.
`.trim();

  const stream = streamText({
    model: avalAi("gpt-4o-mini"),
    messages,
    system: systemMessage,
    experimental_generateMessageId: nanoid,
    experimental_toolCallStreaming: true,
    experimental_transform: [smoothStream(), monitorStream()],
  });

  return stream.toDataStreamResponse();
}
