/**
 * Forum Insights Service
 * Uses GPT to generate synthesized insights from car forums and Reddit
 */

import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert automotive analyst who synthesizes owner opinions from Reddit, car forums, and enthusiast communities. When given a car make, model, and year, provide a comprehensive summary of what real owners say.

Generate insights in the following JSON structure:
{
  "reddit": {
    "sentiment": "positive" | "mixed" | "negative",
    "topTopics": ["array of 5 common discussion topics"],
    "commonPraises": ["array of 3-4 things owners love"],
    "commonComplaints": ["array of 3-4 common complaints"],
    "sampleQuotes": [
      { "text": "realistic owner quote", "subreddit": "r/cars or r/[make]" }
    ]
  },
  "forums": [
    {
      "name": "forum name like '[Make]Nation' or 'CarGurus Forums'",
      "sentiment": "positive" | "mixed" | "negative",
      "keyTakeaways": ["array of 3 key points from this community"]
    }
  ]
}

Guidelines:
- Be realistic and balanced - include both positives and negatives
- Use casual, authentic-sounding language for quotes
- Focus on practical ownership concerns (reliability, maintenance costs, real MPG, common issues)
- Reference specific model years when relevant
- Include specific subreddits like r/whatcarshouldIbuy, r/cars, r/[make]`;

export interface ForumInsights {
  reddit: {
    sentiment: "positive" | "mixed" | "negative";
    topTopics: string[];
    commonPraises: string[];
    commonComplaints: string[];
    sampleQuotes: Array<{ text: string; subreddit: string }>;
  };
  forums: Array<{
    name: string;
    sentiment: "positive" | "mixed" | "negative";
    keyTakeaways: string[];
  }>;
}

export async function generateForumInsights(
  make: string,
  model: string,
  year: number
): Promise<ForumInsights> {
  try {
    const userPrompt = `Generate forum insights and owner opinions for a ${year} ${make} ${model}. What do real owners on Reddit and car forums say about this vehicle?`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const insights = JSON.parse(content) as ForumInsights;
    return insights;
  } catch (error) {
    console.error("Error generating forum insights:", error);
    // Return fallback insights
    return generateFallbackInsights(make, model, year);
  }
}

function generateFallbackInsights(make: string, model: string, year: number): ForumInsights {
  return {
    reddit: {
      sentiment: "positive",
      topTopics: [
        "Reliability concerns",
        "Real-world fuel economy",
        "Comparison with competitors",
        "Long-term ownership costs",
        "Common maintenance items",
      ],
      commonPraises: [
        "Solid build quality and reliability",
        "Good resale value",
        "Comfortable for daily driving",
      ],
      commonComplaints: [
        "Infotainment system could be more responsive",
        "Some road noise at highway speeds",
        "Dealer markups in some areas",
      ],
      sampleQuotes: [
        {
          text: `Had my ${model} for 2 years now, no major issues. Just regular maintenance. Really happy with it.`,
          subreddit: `r/${make.toLowerCase()}`,
        },
        {
          text: `The ${model} is solid overall. My only complaint is the gas mileage isn't quite what they advertise.`,
          subreddit: "r/whatcarshouldIbuy",
        },
        {
          text: `Between this and the competition, I chose the ${model} for reliability. No regrets.`,
          subreddit: "r/cars",
        },
      ],
    },
    forums: [
      {
        name: `${make}Nation`,
        sentiment: "positive",
        keyTakeaways: [
          "Most owners report excellent reliability past 100K miles",
          "Regular maintenance is key to longevity",
          "Holds value well compared to competitors",
        ],
      },
      {
        name: "CarGurus Forums",
        sentiment: "mixed",
        keyTakeaways: [
          "Mixed reviews on dealer service quality",
          "Some owners recommend extended warranty",
          "Generally positive feedback on ownership experience",
        ],
      },
    ],
  };
}

