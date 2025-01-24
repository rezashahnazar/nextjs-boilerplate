import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getSystemPrompt } from "@/services/system-prompt";
import { nanoid } from "nanoid";
import { smoothStream } from "ai";

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
    system: await getSystemPrompt(),
    experimental_generateMessageId: nanoid,
    experimental_toolCallStreaming: true,
    experimental_transform: [
      smoothStream(),
      () => {
        return new TransformStream({
          transform(chunk, controller) {
            console.log(chunk);
            controller.enqueue(chunk);
          },
        });
      },
    ],
  });

  return stream.toDataStreamResponse();
}
