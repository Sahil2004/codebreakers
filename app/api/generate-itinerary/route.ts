import { NextResponse } from "next/server";
import { GeminiQuotaError, generateJson } from "@/lib/gemini";
import type { Itinerary } from "@/lib/types";
import { supabaseServerServiceRole } from "@/lib/supabase";

type TripPlannerInput = {
  number_of_days: number;
  budget: string;
  interests: string[];
  starting_city: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<
    TripPlannerInput
  > | null;

  const number_of_days = Number(body?.number_of_days);
  const budget = body?.budget?.trim();
  const interests = Array.isArray(body?.interests)
    ? body!.interests.map(String).map((s) => s.trim()).filter(Boolean)
    : [];
  const starting_city = body?.starting_city?.trim();

  if (!Number.isFinite(number_of_days) || number_of_days < 1 || number_of_days > 30)
    return NextResponse.json({ error: "Invalid number_of_days" }, { status: 400 });
  if (!budget) return NextResponse.json({ error: "Missing budget" }, { status: 400 });
  if (!starting_city)
    return NextResponse.json({ error: "Missing starting_city" }, { status: 400 });

  let itinerary: Itinerary;
  try {
    itinerary = await generateJson<Itinerary>({
      system:
        "You are an expert trip planner for North India. Build realistic day-by-day itineraries with travel time awareness. Include a mix of culture, heritage, nature, eco-tourism, and local food when relevant. Avoid unsafe/illegal suggestions.",
      user: [
        `Plan a ${number_of_days}-day trip in North India.`,
        `Starting city: ${starting_city}.`,
        `Budget: ${budget}.`,
        `Interests: ${interests.length ? interests.join(", ") : "general"}`,
      ].join("\n"),
      schemaHint: `{
  "days": [
    { "day": 1, "city": "string", "activities": ["string"] }
  ],
  "estimated_budget": "string",
  "travel_tips": ["string"]
}`,
    });
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
      { error: "Failed to generate itinerary." },
      { status: 500 },
    );
  }

  const user_query = JSON.stringify({
    number_of_days,
    budget,
    interests,
    starting_city,
  });

  // Store in Supabase (server-side only). Requires SUPABASE_SERVICE_ROLE_KEY.
  try {
    const supabase = supabaseServerServiceRole();
    await supabase.from("trips").insert({
      user_query,
      itinerary_json: itinerary,
    });
  } catch {
    // If env key not configured, still return itinerary.
  }

  return NextResponse.json(itinerary);
}

