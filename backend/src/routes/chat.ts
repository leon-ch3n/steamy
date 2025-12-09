import { Router, Request, Response } from "express";
import { generateFollowUpQuestions } from "../services/openai.js";
import { generateRecommendationSummary } from "../services/recommendations.js";

export const chatRouter = Router();

interface FollowUpRequest {
  query: string;
}

interface RecommendationRequest {
  context: string;
}

chatRouter.post("/follow-up", async (req: Request<object, object, FollowUpRequest>, res: Response) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Query is required" });
      return;
    }

    const questions = await generateFollowUpQuestions(query);

    res.json({ questions });
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    res.status(500).json({ error: "Failed to generate follow-up questions" });
  }
});

chatRouter.post("/recommendation", async (req: Request<object, object, RecommendationRequest>, res: Response) => {
  try {
    const { context } = req.body;

    if (!context || typeof context !== "string") {
      res.status(400).json({ error: "Context is required" });
      return;
    }

    const analysis = await generateRecommendationSummary(context);

    res.json(analysis);
  } catch (error) {
    console.error("Error generating recommendation:", error);
    res.status(500).json({ error: "Failed to generate recommendation" });
  }
});

