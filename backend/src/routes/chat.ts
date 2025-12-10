import { Router, Request, Response } from "express";
import { generateFollowUpQuestions, evaluateAndRespond, ConversationTurn } from "../services/openai.js";
import { generateRecommendationSummary } from "../services/recommendations.js";

export const chatRouter = Router();

interface FollowUpRequest {
  query: string;
}

interface RecommendationRequest {
  context: string;
}

interface EvaluateRequest {
  initialQuery: string;
  conversation: ConversationTurn[];
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

/**
 * Iterative conversation evaluation endpoint.
 * Evaluates the conversation so far and returns either:
 * - ready: false + nextQuestion (continue conversation)
 * - ready: true + summary (proceed to recommendations)
 */
chatRouter.post("/evaluate", async (req: Request<object, object, EvaluateRequest>, res: Response) => {
  try {
    const { initialQuery, conversation } = req.body;

    if (!initialQuery || typeof initialQuery !== "string") {
      res.status(400).json({ error: "initialQuery is required" });
      return;
    }

    if (!Array.isArray(conversation)) {
      res.status(400).json({ error: "conversation must be an array" });
      return;
    }

    // Validate conversation structure
    for (const turn of conversation) {
      if (typeof turn.question !== "string" || typeof turn.answer !== "string") {
        res.status(400).json({ error: "Each conversation turn must have question and answer strings" });
        return;
      }
    }

    const evaluation = await evaluateAndRespond(initialQuery, conversation);

    res.json(evaluation);
  } catch (error) {
    console.error("Error evaluating conversation:", error);
    res.status(500).json({ error: "Failed to evaluate conversation" });
  }
});

