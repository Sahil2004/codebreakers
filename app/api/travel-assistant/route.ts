import { NextResponse } from "next/server";
import { GeminiQuotaError, generateText } from "@/lib/gemini";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { message?: string }
    | null;

  const message = body?.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Missing message" }, { status: 400 });
  }

  try {
    const answer = await generateText({
      system:
        "You are a helpful North India travel assistant. Be practical, safety-aware, and budget-aware. Prefer bullet points. If timing matters, mention seasons/monsoon/winters. Keep answers concise.",
      user: message,
    });
    return NextResponse.json({ answer });
  } catch (err) {
    if (err instanceof GeminiQuotaError) {
      const headers = new Headers();
      if (err.retryAfterSeconds) {
        headers.set("Retry-After", String(err.retryAfterSeconds));
      }
      return NextResponse.json(
        { error: err.message, retry_after_seconds: err.retryAfterSeconds },
        { status: 429, headers },
      );
    }
    return NextResponse.json(
      { error: "Failed to generate answer." },
      { status: 500 },
    );
  }
}

