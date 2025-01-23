import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, smoothStream } from "ai";
import { getSystemPrompt } from "./system-prompt";

export type Provider = "openai" | "openrouter";
export type StreamFunction = "streamText" | "streamObject";

export type ProviderConfig = {
  provider?: Provider;
  model?: string;
  streamFn?: StreamFunction;
};

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

const DEFAULT_PROVIDER_CONFIG: Required<ProviderConfig> = {
  provider: "openai",
  model: "gpt-4o-mini",
  streamFn: "streamText",
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

  private getProviderClient(provider: Provider) {
    switch (provider) {
      case "openai":
        return createOpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          baseURL: process.env.OPENAI_BASE_URL,
          compatibility: "strict",
        });
      case "openrouter":
        return createOpenRouter({
          apiKey: process.env.OPENROUTER_API_KEY!,
        });
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private getStreamFunction(streamFn: StreamFunction) {
    switch (streamFn) {
      case "streamText":
        return streamText;
      case "streamObject":
        throw new Error("streamObject not implemented yet");
      default:
        throw new Error(`Unsupported stream function: ${streamFn}`);
    }
  }

  private async streamChat(
    messages: Message[],
    options: ChatOptions = {},
    config: ProviderConfig = {}
  ) {
    const systemPrompt = await getSystemPrompt();
    const apiMessages = [systemPrompt, ...messages];

    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    const mergedConfig = { ...DEFAULT_PROVIDER_CONFIG, ...config };

    const provider = this.getProviderClient(mergedConfig.provider);
    const streamFn = this.getStreamFunction(mergedConfig.streamFn);

    return streamFn({
      model: provider(mergedConfig.model),
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

  private async chat(
    messages: Message[],
    options: ChatOptions = {},
    config: ProviderConfig = {}
  ) {
    const stream = await this.streamChat(messages, options, config);
    return this.prepareDataStreamResponse(stream);
  }

  static async streamDataResponse(
    messages: Message[],
    config: ProviderConfig = {}
  ) {
    return ChatService.getInstance().chat(messages, {}, config);
  }
}
