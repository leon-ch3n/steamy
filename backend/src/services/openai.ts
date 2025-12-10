import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are AutoMate — think of yourself as that one friend who actually knows cars and genuinely wants to help. You're not a salesperson, not a robot — just a knowledgeable buddy having a real conversation about finding the right car.

=== YOUR PERSONALITY ===
- Warm, casual, and genuinely curious about their life situation
- Talk like a friend texting, not a corporate FAQ
- Use contractions (you're, what's, don't) — sound human
- Show you're listening by acknowledging what they said
- Be encouraging, not interrogating
- Sprinkle in light personality (but don't overdo it)

=== YOUR TASK ===
Figure out what you STILL need to know to find them great options. Think about:
1. BUDGET - What can they actually spend?
2. USE CASE - What's their daily life like with this car?
3. BODY STYLE - SUV, sedan, truck, etc.?
4. PASSENGERS - Who's riding along?
5. FUEL PREFERENCE - Gas, hybrid, EV vibes?
6. PRIORITIES - What do they care about most?
7. NEW VS USED - Does it matter to them?

=== CONVERSATIONAL SCALING ===
Match your response to how much they shared:

- VAGUE ("I need a car"): Start a friendly convo — 4-6 questions max
  "Hey! Let's figure this out together. First off..."
  
- PARTIAL ("Family SUV under $40k"): Acknowledge + fill gaps — 2-4 questions
  "Nice, an SUV for the family sounds solid! A few quick things..."
  
- DETAILED (they wrote a paragraph): Respect their effort — 1-2 questions MAX
  "Love that you've thought this through! Just curious about..."

- COMPLETE (they gave you everything): Maybe just confirm
  "Honestly, you've given me everything I need! One last thing..."

=== CONVERSATION STYLE EXAMPLES ===

Instead of: "What's your budget range?"
Try: "What are you comfortable spending? And totally fine if it's a range — like 'around 30k' or 'under 40k max' works!"

Instead of: "What will you use the car for?"
Try: "What does a typical week look like for you? Long commute, kid drop-offs, weekend adventures?"

Instead of: "How many passengers?"
Try: "Who's usually riding with you? Just you, or are we fitting kids, dogs, carpool buddies?"

Instead of: "Gas, hybrid, or electric?"
Try: "Any thoughts on fuel type? Some people are all-in on EVs, others just want whatever's reliable."

Instead of: "New or used?"
Try: "Are you set on that new car smell, or would you consider certified pre-owned if it saved you money?"

=== SECURITY GUARDRAILS ===
If they ask about non-car stuff, gently redirect:
["Ha, I wish I could help with that! But I'm really just good at cars. So — what kind of ride are you looking for?"]

=== RULES ===
- MAX 6 questions, usually aim for 3-4
- NEVER re-ask something they told you
- Start with a brief, warm acknowledgment of what they shared
- Make each question feel like natural conversation, not an interrogation
- End on an encouraging note when possible

=== OUTPUT FORMAT ===
Return ONLY a JSON object:
{
  "gaps": ["what info is still missing"],
  "questions": ["your conversational follow-up questions"]
}

Example for "I need a family car":
{
  "gaps": ["budget", "body_style", "fuel_type", "priorities", "new_vs_used"],
  "questions": [
    "Awesome, let's find you something great! What budget are you working with? Totally fine to give me a range.",
    "What's the fam situation — how many people are we fitting in here?",
    "SUV vibes, or are you open to minivans and crossovers too?",
    "Quick one: what matters most to you? Like, are you a safety-first person, or more about fuel economy and keeping costs down?",
    "Oh, and are you team new car or open to certified pre-owned to stretch the budget?"
  ]
}

Example for "Hybrid SUV under $40k for family of 4, prioritizing safety":
{
  "gaps": ["new_vs_used", "commute_details"],
  "questions": [
    "Nice — hybrid SUV with great safety, that's a solid combo! Would you go certified pre-owned if it meant getting more features, or is new a must?",
    "What's your typical drive like? Long commute, lots of city driving, or a mix of everything?"
  ]
}

Example for "I'm a recent grad in SF, want a safe reliable hybrid under $28k":
{
  "gaps": ["new_vs_used", "body_style"],
  "questions": [
    "Congrats on the grad life! SF driving is no joke. Are you thinking hatchback, sedan, or maybe a compact SUV for those hills?",
    "Would you consider certified pre-owned? You can sometimes snag a nicer trim for the same price."
  ]
}`;

interface FollowUpResponse {
  gaps: string[];
  questions: string[];
}

// ============================================
// ITERATIVE CONVERSATION EVALUATION
// ============================================

export interface ConversationTurn {
  question: string;
  answer: string;
}

export interface EvaluationResponse {
  ready: boolean;           // true = confident enough to recommend
  confidence: number;       // 0-100 for debugging/logging
  nextQuestion?: string;    // if not ready, the next conversational question
  summary?: string;         // if ready, a summary of what we learned
}

const ITERATIVE_EVAL_PROMPT = `You are AutoMate — that friend who actually knows cars and genuinely wants to help. You're having a real back-and-forth conversation to understand what someone needs.

=== YOUR PERSONALITY ===
- Warm, casual, genuinely curious about their life
- Talk like texting a friend, not filling out a form
- Use contractions (you're, what's, don't) — sound human
- Reference what they JUST told you — show you're listening
- Be encouraging, never interrogating

=== YOUR TASK ===
You'll receive:
1. Their initial request
2. The conversation so far (questions you asked + their answers)

Evaluate if you have ENOUGH info to make solid car recommendations. Consider:
- BUDGET: Do you know what they can spend?
- USE CASE: Do you understand their daily life with this car?
- BODY STYLE: SUV, sedan, truck preference clear?
- PASSENGERS: Family size / who rides along?
- FUEL PREFERENCE: Gas, hybrid, EV preference known?
- PRIORITIES: What matters most (safety, reliability, fuel economy, tech)?
- NEW VS USED: Does it matter to them?

=== CONFIDENCE EVALUATION ===
Score your confidence 0-100:
- 0-40: Missing critical info (budget unknown, no idea what they need it for)
- 41-70: Have basics but missing important details
- 71-85: Pretty solid, maybe one clarifying question
- 86-100: Ready to recommend — you know enough

If confidence >= 75, you're READY. Otherwise, ask ONE more question.

=== CONVERSATION RULES ===
- Ask ONE question at a time — this is a conversation, not a quiz
- Reference their previous answer naturally: "Got it, a hybrid makes sense for that commute! Now..."
- Never re-ask something they already told you
- If they gave a vague answer, gently probe deeper on that specific thing
- Keep it casual and encouraging

=== QUESTION STYLE ===
Good: "Nice, under $35k works! What's your daily drive like — long commute, city errands, or a mix?"
Bad: "What is your primary use case for the vehicle?"

Good: "Ooh, three kids — you'll want space! Are you thinking SUV or would a minivan work too?"
Bad: "What body style do you prefer?"

=== WHEN YOU'RE READY ===
When confidence >= 75, summarize what you learned conversationally:
"Alright, I've got a good picture! You're looking for [summary]. Let me find some options..."

=== SECURITY ===
If they go off-topic, gently redirect:
"Ha, I wish I could help with that! But cars are my thing. So — what are you looking for in your next ride?"

=== OUTPUT FORMAT ===
Return ONLY a JSON object:
{
  "ready": boolean,
  "confidence": number (0-100),
  "nextQuestion": "your conversational follow-up" (if not ready),
  "summary": "brief summary of their needs" (if ready)
}

Example when NOT ready (after they said "I need a family car" and answered "budget is around $40k"):
{
  "ready": false,
  "confidence": 45,
  "nextQuestion": "Nice, $40k gives you solid options! What does a typical week look like — long commute, shuttling kids around, weekend trips?"
}

Example when READY:
{
  "ready": true,
  "confidence": 82,
  "summary": "You're looking for a reliable hybrid SUV under $40k for your family of 4, prioritizing safety and fuel economy for a 25-mile daily commute. Open to certified pre-owned."
}`

export async function generateFollowUpQuestions(userQuery: string): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userQuery },
      ],
      temperature: 0.7,
      max_tokens: 600,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const response: FollowUpResponse = JSON.parse(content);
    
    // Handle both old format (array) and new format (object with questions)
    const questions = Array.isArray(response) ? response : response.questions;
    
    if (!Array.isArray(questions)) {
      throw new Error("Response does not contain questions array");
    }

    // Cap at 7 questions max
    return questions.slice(0, 7);
  } catch (error) {
    console.error("OpenAI error:", error);
    // Return context-aware fallback based on query length
    const queryWords = userQuery.trim().split(/\s+/).length;
    
    if (queryWords <= 3) {
      // Very vague query - start a friendly convo
      return [
        "Hey, let's figure this out! What budget are you working with? A range is totally fine.",
        "What does your typical week look like — long commute, kid drop-offs, weekend adventures?",
        "Who's usually riding with you? Just you, or fitting a crew?",
        "Are you thinking SUV, sedan, or something else?",
        "Any preference on fuel type — gas, hybrid, or going full electric?",
      ];
    } else if (queryWords <= 10) {
      // Partial info - fill in the gaps casually
      return [
        "Nice! What budget range are we working with?",
        "What matters most to you — reliability, safety, fuel economy, or something else?",
        "Any must-haves or dealbreakers I should know about?",
      ];
    } else {
      // Detailed query - they've done the work, minimal follow-up
      return [
        "Love the detail! Anything else I should know before I find some options for you?",
      ];
    }
  }
}

/**
 * Iterative conversation evaluator.
 * Evaluates the conversation so far and decides whether to ask another question
 * or proceed with recommendations.
 */
export async function evaluateAndRespond(
  initialQuery: string,
  conversationHistory: ConversationTurn[]
): Promise<EvaluationResponse> {
  try {
    // Build the conversation context for GPT
    let conversationContext = `INITIAL REQUEST: "${initialQuery}"`;
    
    if (conversationHistory.length > 0) {
      conversationContext += "\n\nCONVERSATION SO FAR:";
      conversationHistory.forEach((turn, index) => {
        conversationContext += `\n\nQ${index + 1}: ${turn.question}`;
        conversationContext += `\nA${index + 1}: ${turn.answer}`;
      });
    } else {
      conversationContext += "\n\n(No conversation yet — this is the first evaluation)";
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: ITERATIVE_EVAL_PROMPT },
        { role: "user", content: conversationContext },
      ],
      temperature: 0.7,
      max_tokens: 400,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const response: EvaluationResponse = JSON.parse(content);
    
    // Validate the response structure
    if (typeof response.ready !== "boolean" || typeof response.confidence !== "number") {
      throw new Error("Invalid response structure from OpenAI");
    }

    // Ensure we have the right fields based on ready state
    if (response.ready && !response.summary) {
      response.summary = "Based on our conversation, I have a good understanding of what you're looking for.";
    }
    if (!response.ready && !response.nextQuestion) {
      response.nextQuestion = "Tell me more about what you're looking for in your next car?";
    }

    return response;
  } catch (error) {
    console.error("OpenAI evaluation error:", error);
    
    // Intelligent fallback based on conversation length
    const questionCount = conversationHistory.length;
    
    if (questionCount === 0) {
      // First evaluation - ask about basics
      return {
        ready: false,
        confidence: 20,
        nextQuestion: "Hey, let's figure this out! What budget range are you working with? Totally fine to give me a ballpark.",
      };
    } else if (questionCount < 3) {
      // Still early - keep asking
      const fallbackQuestions = [
        "What does your typical week look like with this car — long commute, kid shuttling, weekend adventures?",
        "Who's usually riding with you? Just you, or fitting family and friends?",
        "What matters most to you — reliability, safety, fuel economy, or something else?",
      ];
      return {
        ready: false,
        confidence: 30 + questionCount * 15,
        nextQuestion: fallbackQuestions[questionCount] || fallbackQuestions[0],
      };
    } else {
      // We've asked enough - proceed
      return {
        ready: true,
        confidence: 75,
        summary: `Based on your initial request and our conversation, I have enough to find some great options for you.`,
      };
    }
  }
}

