/**
 * GPT-Powered Car Recommendations Service
 * Generates personalized car recommendations based on user query
 */

import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CarRecommendation {
  name: string;
  make: string;
  model: string;
  year: number;
  priceRange: string;
  type: string;
  keySpecs: {
    mpg?: string;
    range?: string;
    drivetrain: string;
    seating?: string;
    horsepower?: string;
  };
}

export interface RecommendationResponse {
  summary: string;
  recommendations: CarRecommendation[];
}

const SYSTEM_PROMPT = `You are AutoMate, an AI that helps people find the right car. You talk like a knowledgeable friend who actually knows cars - casual, honest, and helpful. You're not a salesperson.

Your job: Write ONE detailed summary paragraph (about 150-200 words, ~30-45 second read) that gives the user real, actionable car-buying advice based on their needs. This is the main content - the car cards below are just quick references.

In your summary:
- Acknowledge what they're looking for and show you understood their priorities
- Give SPECIFIC advice about what to look for (features, trims, things to avoid)
- Be honest about trade-offs ("if you want X, you'll have to compromise on Y")
- Include insider tips (best time to buy, which trims are worth it, CPO vs new, what to negotiate)
- Point out things they might not have considered
- Mention specific cars by name when relevant
- Wrap **key terms, features, and car names** in double asterisks for highlighting

DO NOT use bullet points or lists. Write in flowing paragraphs like you're talking to a friend.

The car recommendations are just simple cards - no descriptions needed, just the basics.

Respond with JSON:
{
  "summary": "Your 150-200 word detailed advice paragraph with **highlighted terms**. No bullet points. Write conversationally like a car-savvy friend giving real advice.",
  "recommendations": [
    {
      "name": "Full vehicle name",
      "make": "Brand",
      "model": "Model",
      "year": 2024,
      "priceRange": "$XX,XXX – $XX,XXX",
      "type": "SUV/Sedan/etc",
      "keySpecs": {
        "mpg": "XX city / XX hwy" or null,
        "range": "XXX miles" or null,
        "drivetrain": "AWD/FWD/RWD",
        "seating": "5 passengers",
        "horsepower": "XXX hp" or null
      }
    }
  ]
}`;

export async function getCarRecommendations(
  userQuery: string
): Promise<RecommendationResponse> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userQuery },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content) as RecommendationResponse;
    
    // Ensure we have valid recommendations
    if (!result.recommendations || result.recommendations.length === 0) {
      return getFallbackRecommendations(userQuery);
    }

    return result;
  } catch (error) {
    console.error("Error getting car recommendations:", error);
    return getFallbackRecommendations(userQuery);
  }
}

function getFallbackRecommendations(query: string): RecommendationResponse {
  const lowerQuery = query.toLowerCase();
  
  const isEV = lowerQuery.includes("ev") || lowerQuery.includes("electric");
  const isSUV = lowerQuery.includes("suv") || lowerQuery.includes("family");
  
  const fallbackCars: CarRecommendation[] = [];
  
  if (isEV) {
    fallbackCars.push({
      name: "Tesla Model Y Long Range",
      make: "Tesla",
      model: "Model Y",
      year: 2024,
      priceRange: "$45,000 – $52,000",
      type: "EV SUV",
      keySpecs: { range: "310 miles", drivetrain: "AWD", horsepower: "384 hp" }
    });
  }
  
  if (isSUV || fallbackCars.length === 0) {
    fallbackCars.push(
      {
        name: "Toyota RAV4 Hybrid XLE",
        make: "Toyota",
        model: "RAV4",
        year: 2024,
        priceRange: "$33,000 – $38,000",
        type: "Hybrid SUV",
        keySpecs: { mpg: "41 city / 38 hwy", drivetrain: "AWD", seating: "5 passengers" }
      },
      {
        name: "Mazda CX-50 Turbo",
        make: "Mazda",
        model: "CX-50",
        year: 2024,
        priceRange: "$38,000 – $43,000",
        type: "Compact SUV",
        keySpecs: { mpg: "24 city / 30 hwy", drivetrain: "AWD", horsepower: "256 hp" }
      },
      {
        name: "Honda CR-V Hybrid Sport-L",
        make: "Honda",
        model: "CR-V",
        year: 2024,
        priceRange: "$36,000 – $40,000",
        type: "Hybrid SUV",
        keySpecs: { mpg: "40 city / 34 hwy", drivetrain: "AWD", seating: "5 passengers" }
      }
    );
  }
  
  return {
    summary: "Alright, so you're looking for something practical but not boring. Here's the deal: the **Toyota RAV4 Hybrid** is the safe bet with **40+ MPG** and Toyota's legendary reliability, but the interior feels a bit cheap for what you're paying. If you want something that actually feels premium and is fun to drive, the **Mazda CX-50** punches way above its weight class on interior quality, though you'll sacrifice some fuel economy. The **Honda CR-V Hybrid** splits the difference nicely with a more refined cabin than the Toyota and better rear seat space than the Mazda. Pro tip: if you're going Toyota, skip the XLE Premium trim - the upgrades aren't worth the extra $3k. For the Mazda, definitely get the turbo engine; it transforms the car. All three hold their value well, so buying certified pre-owned could save you $5-8k with minimal risk.",
    recommendations: fallbackCars.slice(0, 6)
  };
}

