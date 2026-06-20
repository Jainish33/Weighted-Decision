import Anthropic from "@anthropic-ai/sdk";
import { systemPrompt, SCRIPTED_QUESTIONS } from "@/lib/conversation";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ChatRequest {
  recipientName: string;
  relationship: string;
  occasion: string;
  messages: { role: "user" | "assistant"; content: string }[];
}

export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequest;

  if (!process.env.ANTHROPIC_API_KEY) {
    // Scripted fallback: serve the next question in the sequence.
    const asked = body.messages.filter((m) => m.role === "assistant").length;
    const next =
      SCRIPTED_QUESTIONS[Math.min(asked, SCRIPTED_QUESTIONS.length - 1)];
    return new Response(next, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const client = new Anthropic();

  const stream = client.messages.stream({
    model: process.env.CHAT_MODEL || "claude-opus-4-8",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: systemPrompt(body),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: body.messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            "\n\nWe lost the thread for a moment. Please send that again.",
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
