import { NextResponse } from "next/server";
import { supabaseServerAnon } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hidden = searchParams.get("hidden");
  const q = searchParams.get("q");

  const supabase = supabaseServerAnon();
  let query = supabase
    .from("destinations")
    .select(
      "id,name,state,description,image,eco_score,culture_highlight,is_hidden_gem",
    )
    .order("eco_score", { ascending: false })
    .order("id", { ascending: true });

  if (hidden === "true") query = query.eq("is_hidden_gem", true);
  if (hidden === "false") query = query.eq("is_hidden_gem", false);
  if (q) query = query.ilike("name", `%${q}%`);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ destinations: data ?? [] });
}

