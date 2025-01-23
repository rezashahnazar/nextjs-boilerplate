import { createOpenAI } from "@ai-sdk/openai";
import { streamText, smoothStream } from "ai";
import { getSystemPrompt } from "./system-prompt";

// Create an OpenAI API client with custom configuration
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
  compatibility: "strict",
});

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type ChatOptions = {
  temperature?: number;
  maxTokens?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
};

const DEFAULT_OPTIONS: ChatOptions = {
  temperature: 0.7,
  maxTokens: 2000,
  presencePenalty: 0.1,
  frequencyPenalty: 0.1,
};

export class ChatService {
  private static instance: ChatService;
  private constructor() {}

  private static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private async streamChat(messages: Message[], options: ChatOptions = {}) {
    const systemPrompt = await getSystemPrompt();
    const apiMessages = [systemPrompt, ...messages];

    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    return streamText({
      model: openai("gpt-4-turbo"),
      messages: apiMessages,
      temperature: mergedOptions.temperature,
      maxTokens: mergedOptions.maxTokens,
      presencePenalty: mergedOptions.presencePenalty,
      frequencyPenalty: mergedOptions.frequencyPenalty,
      experimental_transform: smoothStream(),
    });
  }

  private prepareDataStreamResponse(stream: ReturnType<typeof streamText>) {
    return stream.toDataStreamResponse({
      getErrorMessage: (error) => {
        console.error("Chat API error:", error);
        return "متاسفانه در پردازش درخواست شما خطایی رخ داد.";
      },
      sendUsage: true,
    });
  }

  private async chat(messages: Message[], options: ChatOptions = {}) {
    const stream = await this.streamChat(messages, options);
    return this.prepareDataStreamResponse(stream);
  }

  static async streamDataResponse(messages: Message[]) {
    return ChatService.getInstance().chat(messages);
  }
}
