import Anthropic from "@anthropic-ai/sdk";

// Reads ANTHROPIC_API_KEY from the environment — set it in Vercel
// (Project → Settings → Environment Variables). NEVER prefix it with VITE_,
// or Vite would inline it into the public browser bundle.
const client = new Anthropic();

// Stable coaching instructions. Kept in its own block with cache_control so it
// caches once it's long enough (Opus's minimum cacheable prefix is ~4096 tokens
// — short prompts simply won't cache, which is fine). The volatile per-user goal
// context goes in a SEPARATE block after this one so it never invalidates the
// cached prefix.
const SYSTEM_INSTRUCTIONS =
  "You are a warm, wise personal-growth coach. You help the user reflect, " +
  "stay motivated, and plan their next step. Be thoughtful and concise — 2-4 " +
  'sentences. Reference the user\'s stated "why" when it\'s relevant. Don\'t use ' +
  "bullet lists unless asked. Respond directly with your reply only — no " +
  "preamble and no meta-commentary about your reasoning.";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "Server is not configured: ANTHROPIC_API_KEY is missing." });
  }

  try {
    const { context = "No goals yet.", messages = [] } = req.body ?? {};

    // Only trust well-formed user/assistant turns from the client.
    const safeMessages = (Array.isArray(messages) ? messages : [])
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map((m) => ({ role: m.role, content: m.content }));

    if (!safeMessages.length || safeMessages[safeMessages.length - 1].role !== "user") {
      return res.status(400).json({ error: "messages must be a non-empty array ending with a user turn." });
    }

    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      thinking: { type: "disabled" }, // short conversational replies — keep it fast
      system: [
        { type: "text", text: SYSTEM_INSTRUCTIONS, cache_control: { type: "ephemeral" } },
        { type: "text", text: `Here are the user's current goals and resolutions:\n\n${context}` },
      ],
      messages: safeMessages,
    });

    const reply = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    return res.status(200).json({ reply: reply || "I'm not sure what to say — could you rephrase?" });
  } catch (err) {
    console.error("coach request failed", err);
    const status = err instanceof Anthropic.APIError && err.status ? err.status : 500;
    return res.status(status).json({ error: "The coach is unavailable right now. Please try again." });
  }
}
