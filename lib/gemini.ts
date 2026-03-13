import { GoogleGenerativeAI } from "@google/generative-ai";
import { requireEnv } from "@/lib/env";

function modelName() {
  return process.env.GEMINI_MODEL || "gemini-2.0-flash";
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
  const apiKey = requireEnv("GEMINI_API_KEY");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName(),
    generationConfig: {
      temperature: 0.6,
      responseMimeType: "application/json",
    },
  });

  const prompt = [
    `SYSTEM:\n${args.system}`,
    `\nUSER:\n${args.user}`,
    `\nOUTPUT JSON SCHEMA (hint):\n${args.schemaHint}`,
  ].join("\n");

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text) as T;
  } catch (err) {
    if (isQuota429(err)) {
      const retry = parseRetryAfterSeconds(err);
      // One short retry helps for per-minute limits.
      if (retry && retry > 0 && retry <= 30) {
        await sleep(retry * 1000);
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return JSON.parse(text) as T;
      }
      throw new GeminiQuotaError(
        "Gemini quota exceeded. Please try again shortly or update your API quota/billing.",
        retry,
      );
    }
    throw err;
  }
}

export async function generateText(args: { system: string; user: string }) {
  const apiKey = requireEnv("GEMINI_API_KEY");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName(),
    generationConfig: { temperature: 0.7 },
  });

  const prompt = [`SYSTEM:\n${args.system}`, `\nUSER:\n${args.user}`].join("\n");
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    if (isQuota429(err)) {
      const retry = parseRetryAfterSeconds(err);
      if (retry && retry > 0 && retry <= 30) {
        await sleep(retry * 1000);
        const result = await model.generateContent(prompt);
        return result.response.text();
      }
      throw new GeminiQuotaError(
        "Gemini quota exceeded. Please try again shortly or update your API quota/billing.",
        retry,
      );
    }
    throw err;
  }
}

