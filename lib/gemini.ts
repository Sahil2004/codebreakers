import Groq from "groq-sdk";
import { requireEnv } from "@/lib/env";

function modelName() {
  return process.env.GROQ_MODEL || "llama-3.1-70b-versatile";
}

export class GeminiQuotaError extends Error {
  status = 429 as const;
  retryAfterSeconds?: number;
  constructor(message: string, retryAfterSeconds?: number) {
    super(message);
    this.name = "GeminiQuotaError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

type GeminiErrorLike = {
  status?: number;
  statusText?: string;
  errorDetails?: unknown;
};

function parseRetryAfterSeconds(err: unknown): number | undefined {
  // The SDK surfaces RetryInfo.retryDelay like "26s" in errorDetails sometimes.
  const anyErr = err as GeminiErrorLike;
  const details = anyErr?.errorDetails;
  if (!Array.isArray(details)) return undefined;
  const retryInfo = details.find(
    (d) => d?.["@type"] === "type.googleapis.com/google.rpc.RetryInfo",
  );
  const delay = retryInfo?.retryDelay;
  if (typeof delay !== "string") return undefined;
  const m = delay.match(/^(\d+)\s*s$/);
  if (!m) return undefined;
  return Number(m[1]);
}

function isQuota429(err: unknown) {
  const anyErr = err as GeminiErrorLike;
  return anyErr?.status === 429 || anyErr?.statusText === "Too Many Requests";
}

export async function generateJson<T>(args: {
  system: string;
  user: string;
  schemaHint: string;
}): Promise<T> {
  const apiKey = requireEnv("GROQ_API_KEY");
  const client = new Groq({ apiKey });

  try {
    const completion = await client.chat.completions.create({
      model: modelName(),
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: args.system },
        {
          role: "user",
          content: `${args.user}\n\nReturn a JSON object with this shape (schema hint, not strict):\n${args.schemaHint}`,
        },
      ],
    });
    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Empty Groq JSON response");
    return JSON.parse(content) as T;
  } catch (err) {
    throw err;
  }
}

export async function generateText(args: { system: string; user: string }) {
  const apiKey = requireEnv("GROQ_API_KEY");
  const client = new Groq({ apiKey });
  try {
    const completion = await client.chat.completions.create({
      model: modelName(),
      temperature: 0.7,
      messages: [
        { role: "system", content: args.system },
        { role: "user", content: args.user },
      ],
    });
    const content = completion.choices[0]?.message?.content;
    return content ?? "";
  } catch (err) {
    throw err;
  }
}

