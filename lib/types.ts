export type Destination = {
  id: number;
  name: string;
  state: string;
  description: string;
  image: string;
  eco_score: number;
  culture_highlight: string;
  is_hidden_gem: boolean;
};

export type Itinerary = {
  days: { day: number; city: string; activities: string[] }[];
  estimated_budget: string;
  travel_tips: string[];
};

