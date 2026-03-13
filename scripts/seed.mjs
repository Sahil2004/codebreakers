import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
if (!SERVICE_ROLE) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
});

const seed = [
  // Popular destinations
  {
    name: "Jaipur",
    state: "Rajasthan",
    description: "Pink City of forts, bazaars, and royal palaces.",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=70",
    eco_score: 52,
    culture_highlight: "Amber Fort, City Palace, and block-printed textiles.",
    is_hidden_gem: false,
  },
  {
    name: "Agra",
    state: "Uttar Pradesh",
    description: "Mughal-era architecture and timeless monuments.",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=70",
    eco_score: 40,
    culture_highlight: "Taj Mahal at sunrise; Agra Fort storytelling walks.",
    is_hidden_gem: false,
  },
  {
    name: "Rishikesh",
    state: "Uttarakhand",
    description: "Ganga ghats, yoga ashrams, and rafting adventures.",
    image:
      "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?auto=format&fit=crop&w=1200&q=70",
    eco_score: 74,
    culture_highlight:
      "Ganga Aarti + yoga traditions in the Himalayas foothills.",
    is_hidden_gem: false,
  },
  {
    name: "Leh",
    state: "Ladakh",
    description: "High-altitude desert landscapes and monastery trails.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=70",
    eco_score: 78,
    culture_highlight: "Thiksey/Hemis monasteries; Ladakhi food and crafts.",
    is_hidden_gem: false,
  },
  {
    name: "Varanasi",
    state: "Uttar Pradesh",
    description: "Spiritual riverfront city with ancient lanes and rituals.",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=70",
    eco_score: 35,
    culture_highlight:
      "Kashi Vishwanath, ghats, and classical music heritage.",
    is_hidden_gem: false,
  },
  {
    name: "Spiti Valley",
    state: "Himachal Pradesh",
    description: "Remote cold desert with stark mountains and villages.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=70",
    eco_score: 86,
    culture_highlight: "Key Monastery; homestays and high-altitude culture.",
    is_hidden_gem: false,
  },

  // Hidden gems
  {
    name: "Tirthan Valley",
    state: "Himachal Pradesh",
    description:
      "Riverside hamlets and Great Himalayan National Park gateways.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70",
    eco_score: 90,
    culture_highlight: "Local trout cuisine and forest trail culture.",
    is_hidden_gem: true,
  },
  {
    name: "Kalpa",
    state: "Himachal Pradesh",
    description: "Apple orchards and Kinnaur Kailash views.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=70",
    eco_score: 88,
    culture_highlight: "Kinnauri architecture, shawls, and temple legends.",
    is_hidden_gem: true,
  },
  {
    name: "Chitkul",
    state: "Himachal Pradesh",
    description:
      "Last village near Indo-Tibet border with alpine scenery.",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70",
    eco_score: 87,
    culture_highlight: "Baspa Valley traditions and wooden homes.",
    is_hidden_gem: true,
  },
  {
    name: "Chopta",
    state: "Uttarakhand",
    description: "Mini-Switzerland meadow base for Tungnath trek.",
    image:
      "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1200&q=70",
    eco_score: 91,
    culture_highlight:
      "Kedarnath region folklore and Himalayan temple trails.",
    is_hidden_gem: true,
  },
  {
    name: "Munsiyari",
    state: "Uttarakhand",
    description: "Panchachuli views, village walks, and slow travel.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70",
    eco_score: 89,
    culture_highlight:
      "Kumaoni food + trans-Himalayan trade route stories.",
    is_hidden_gem: true,
  },
];

const { data: existing, error: existingError } = await supabase
  .from("destinations")
  .select("id,name,state");

if (existingError) {
  console.error("Failed to read destinations:", existingError.message);
  console.error(
    "If the table does not exist, run supabase/schema.sql in Supabase SQL editor first.",
  );
  process.exit(1);
}

const existingKey = new Set((existing ?? []).map((r) => `${r.name}||${r.state}`));
const toInsert = seed.filter((r) => !existingKey.has(`${r.name}||${r.state}`));

if (toInsert.length === 0) {
  console.log("Seed: nothing to insert (already seeded).");
  process.exit(0);
}

const { error: insertError } = await supabase.from("destinations").insert(toInsert);
if (insertError) {
  console.error("Seed insert failed:", insertError.message);
  process.exit(1);
}

console.log(`Seeded ${toInsert.length} destinations.`);

