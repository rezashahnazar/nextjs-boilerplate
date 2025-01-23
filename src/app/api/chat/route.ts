import { createOpenAI } from "@ai-sdk/openai";
import { streamText, smoothStream } from "ai";

// Create an OpenAI API client
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

// IMPORTANT: Set the runtime to edge
export const runtime = "edge";

const systemPrompt = {
  role: "system",
  content: `You are a helpful and knowledgeable AI assistant. Your responses should be:
- Clear and concise
- Professional yet friendly
- Accurate and well-researched
- Helpful while maintaining appropriate boundaries
- Respectful of user privacy and security

When you're not sure about something, be honest about your limitations.
Format responses using Markdown when appropriate for better readability.`,
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Add system prompt to the beginning of the conversation
    const apiMessages = [systemPrompt, ...messages];

    // Request the OpenAI API for the response using streamText with smoothStream transform
    const stream = streamText({
      model: openai("gpt-4o-mini"),
      messages: apiMessages,
      temperature: 0.7,
      maxTokens: 2000,
      presencePenalty: 0.1,
      frequencyPenalty: 0.1,
      experimental_transform: smoothStream(),
    });

    // Return the response stream
    return stream.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({ error: "There was an error processing your request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
