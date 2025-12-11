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

Your job: Write a CONCISE summary (80-100 words max) that quickly explains your top picks and key trade-offs. Get straight to the point.

In your summary:
- Briefly acknowledge what they need
- Name 2-3 specific cars and why they fit
- Mention one key trade-off or tip
- Wrap **key car names and important terms** in double asterisks for highlighting

Keep it SHORT and punchy. No fluff. No bullet points.

Respond with JSON:
{
  "summary": "Your 80-100 word concise summary with **highlighted car names and key terms**. Be direct and helpful.",
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
    summary: "Based on what you're looking for, the **Toyota RAV4 Hybrid** is your best bet for reliability and **40+ MPG**. The **Mazda CX-50** offers a more premium feel if you're willing to trade some fuel economy. For a middle ground, the **Honda CR-V Hybrid** has the best rear seat space. Quick tip: consider certified pre-owned to save $5-8k.",
    recommendations: fallbackCars.slice(0, 6)
  };
}

