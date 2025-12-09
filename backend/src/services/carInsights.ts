/**
 * Car Insights Service
 * Uses GPT to generate community-style insights about vehicles
 * (Replaces Reddit sentiment scraping)
 */

import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CarInsights {
  summary: string;
  pros: string[];
  cons: string[];
  commonIssues: string[];
  bestFor: string[];
  notIdealFor: string[];
  competitorComparison: string;
  buyingTips: string[];
  ownerSentiment: "very_positive" | "positive" | "mixed" | "negative";
  reliabilityScore: number; // 1-10
}

const SYSTEM_PROMPT = `You are an expert automotive analyst who synthesizes community knowledge about vehicles. You have deep knowledge of what real owners and enthusiasts say on forums like Reddit (r/whatcarshouldibuy, r/cars, r/askcarsales), car forums, and review sites.

When asked about a vehicle, provide honest, balanced insights based on common owner experiences and expert opinions. Be specific and practical - mention actual features, known issues by model year, and real-world ownership experiences.

Important guidelines:
- Be honest about known issues - don't sugarcoat
- Mention specific model years if relevant (e.g., "2019+ models fixed the transmission issue")
- Compare to direct competitors when relevant
- Focus on practical ownership concerns (reliability, maintenance costs, resale value)
- Include specific tips for buying this vehicle

Respond with a JSON object matching the CarInsights interface.`;

/**
 * Generate community-style insights about a vehicle
 */
export async function getCarInsights(
  make: string,
  model: string,
  year?: number
): Promise<CarInsights | null> {
  try {
    const vehicleDescription = year 
      ? `${year} ${make} ${model}`
      : `${make} ${model} (recent model years)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Provide comprehensive community insights about the ${vehicleDescription}. What do owners and enthusiasts commonly say about this vehicle? Include pros, cons, known issues, who it's best for, and buying tips.

Respond with JSON matching this structure:
{
  "summary": "2-3 sentence overview of owner sentiment",
  "pros": ["specific pro 1", "specific pro 2", ...],
  "cons": ["specific con 1", "specific con 2", ...],
  "commonIssues": ["known issue 1 with context", ...],
  "bestFor": ["ideal use case 1", ...],
  "notIdealFor": ["not ideal for 1", ...],
  "competitorComparison": "How it stacks up vs main competitors",
  "buyingTips": ["specific tip 1", "specific tip 2", ...],
  "ownerSentiment": "very_positive" | "positive" | "mixed" | "negative",
  "reliabilityScore": 1-10
}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const insights = JSON.parse(content) as CarInsights;
    return insights;
  } catch (error) {
    console.error("Error getting car insights:", error);
    return null;
  }
}

/**
 * Get a quick sentiment summary for search results
 */
export async function getQuickSentiment(
  vehicles: Array<{ make: string; model: string; year?: number }>
): Promise<Map<string, { sentiment: string; oneLineSummary: string }>> {
  const results = new Map<string, { sentiment: string; oneLineSummary: string }>();

  try {
    const vehicleList = vehicles
      .map((v) => (v.year ? `${v.year} ${v.make} ${v.model}` : `${v.make} ${v.model}`))
      .join(", ");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a car expert. Provide brief owner sentiment summaries for vehicles. Be concise and honest.",
        },
        {
          role: "user",
          content: `For each of these vehicles, provide a one-line owner sentiment summary and overall sentiment rating.
          
Vehicles: ${vehicleList}

Respond with JSON:
{
  "vehicles": [
    {
      "vehicle": "2024 Toyota RAV4",
      "sentiment": "positive",
      "oneLineSummary": "Reliable and practical; owners love the hybrid's fuel economy"
    },
    ...
  ]
}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (content) {
      const data = JSON.parse(content);
      for (const v of data.vehicles || []) {
        results.set(v.vehicle, {
          sentiment: v.sentiment,
          oneLineSummary: v.oneLineSummary,
        });
      }
    }
  } catch (error) {
    console.error("Error getting quick sentiment:", error);
  }

  return results;
}

/**
 * Compare multiple vehicles
 */
export async function compareVehicles(
  vehicles: Array<{ make: string; model: string; year?: number }>
): Promise<{
  comparison: string;
  rankings: Array<{ vehicle: string; score: number; bestFor: string }>;
  verdict: string;
} | null> {
  try {
    const vehicleList = vehicles
      .map((v) => (v.year ? `${v.year} ${v.make} ${v.model}` : `${v.make} ${v.model}`))
      .join(" vs ");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert automotive analyst. Provide honest, practical comparisons based on owner experiences and real-world data.",
        },
        {
          role: "user",
          content: `Compare these vehicles: ${vehicleList}

Provide a detailed comparison focusing on:
- Reliability and ownership costs
- Practicality and features
- Driving experience
- Value for money
- Who each is best for

Respond with JSON:
{
  "comparison": "Detailed 3-4 paragraph comparison",
  "rankings": [
    { "vehicle": "2024 Toyota RAV4", "score": 8.5, "bestFor": "Families wanting reliability" },
    ...
  ],
  "verdict": "1-2 sentence final recommendation"
}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return null;
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Error comparing vehicles:", error);
    return null;
  }
}

