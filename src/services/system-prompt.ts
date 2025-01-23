type SystemPrompt = {
  role: "system";
  content: string;
};

const DEFAULT_SYSTEM_PROMPT: SystemPrompt = {
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

export async function getSystemPrompt(): Promise<SystemPrompt> {
  try {
    // Here you can add the logic to fetch from your external service
    // For example:
    // const response = await fetch(process.env.SYSTEM_PROMPT_API_URL);
    // return await response.json();

    // For now, return the default prompt
    return DEFAULT_SYSTEM_PROMPT;
  } catch (error) {
    console.error("Failed to fetch system prompt:", error);
    // Fallback to default prompt in case of any errors
    return DEFAULT_SYSTEM_PROMPT;
  }
}
