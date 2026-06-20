import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

// Drafts the card content (page greetings, memory paragraphs, personal
// message, RFID song titles) from the finished conversation transcript.
// Every field is editable by the gifter — the AI is the ghostwriter.

interface DraftRequest {
  recipientName: string;
  relationship: string;
  occasion: string;
  transcript: { role: string; content: string }[];
}

export interface DraftResponse {
  page1Greeting: string;
  page2Memories: string[];
  page4Message: string;
  qualities: string[];
  rfidTitles: string[];
}

const SCHEMA = {
  type: "object" as const,
  properties: {
    page1Greeting: {
      type: "string",
      description: "One short warm greeting line for the cover page",
    },
    page2Memories: {
      type: "array",
      items: { type: "string" },
      description: "3-4 short memory paragraphs, 2-3 sentences each",
    },
    page4Message: {
      type: "string",
      description:
        "The personal message for the final page, 4-6 sentences, first person",
    },
    qualities: {
      type: "array",
      items: { type: "string" },
      description: "Three single-word qualities of the recipient",
    },
    rfidTitles: {
      type: "array",
      items: { type: "string" },
      description:
        "Six Spotify-style song titles, two evoking each quality, e.g. warmth -> Golden Hour Heart",
    },
  },
  required: [
    "page1Greeting",
    "page2Memories",
    "page4Message",
    "qualities",
    "rfidTitles",
  ],
  additionalProperties: false,
};

function fallbackDraft(name: string): DraftResponse {
  return {
    page1Greeting: `For ${name} — some feelings need a song.`,
    page2Memories: [
      "Write a short memory here — where you were, what was said, why it stayed with you.",
      "Add a second moment the two of you still laugh about.",
      "And one quiet moment that meant more than it looked.",
    ],
    page4Message: `Dear ${name}, this card carries the things I don't say often enough. Edit this message to make it yours.`,
    qualities: ["warmth", "courage", "joy"],
    rfidTitles: [
      "Golden Hour Heart",
      "Slow Sunday Light",
      "Brave on Both Sides",
      "Steel and Silk",
      "Confetti Weather",
      "Laughing in the Rain",
    ],
  };
}

export async function POST(req: Request) {
  const body = (await req.json()) as DraftRequest;

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(fallbackDraft(body.recipientName));
  }

  const client = new Anthropic();
  const transcript = body.transcript
    .map((m) => `${m.role === "user" ? "Gifter" : "Studio"}: ${m.content}`)
    .join("\n");

  try {
    const response = await client.messages.create({
      model: process.env.CHAT_MODEL || "claude-opus-4-8",
      max_tokens: 2048,
      system:
        "You are the ghostwriter at Heart Strings, a premium gifting studio. " +
        "From the conversation transcript, draft the card content. Write warm, " +
        "specific, restrained prose drawn from the gifter's own words and " +
        "memories. Match their language (English, Hindi, or Hinglish). " +
        "No exclamation marks. The gifter must feel like the author.",
      messages: [
        {
          role: "user",
          content: `Recipient: ${body.recipientName} (${body.relationship}), occasion: ${body.occasion}.\n\nTranscript:\n${transcript}`,
        },
      ],
      output_config: {
        format: { type: "json_schema", schema: SCHEMA },
      },
    });

    const text = response.content.find((b) => b.type === "text");
    if (text && text.type === "text") {
      return Response.json(JSON.parse(text.text) as DraftResponse);
    }
  } catch {
    // fall through to the editable placeholder draft
  }
  return Response.json(fallbackDraft(body.recipientName));
}
