import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../lib/api";
import logoImg from "../Screenshot_2025-12-08_at_1.37.15_PM-removebg-preview.png";

const suggestions = [
  "I'm a mom of 4 and need a reliable SUV under $35k",
  "First EV under $40k with good range",
  "Sporty sedan for a new grad under $30k",
  "Best family car for road trips",
  "Compact hybrid for city commuting under $28k",
  "Luxury sedan with great safety features",
];

const MAX_QUESTIONS = 8; // Hard limit safety net

interface ConversationTurn {
  question: string;
  answer: string;
}

interface EvaluationResponse {
  ready: boolean;
  confidence: number;
  nextQuestion?: string;
  summary?: string;
}

interface ConversationState {
  initialQuery: string;
  turns: ConversationTurn[];
  currentQuestion: string;
  isReady: boolean;
  summary?: string;
}

export const TryAutoMate = () => {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState<ConversationState | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Redirect to home if not authenticated
  if (!authLoading && !user) {
    navigate("/");
    return null;
  }

  // Call the evaluate endpoint
  const evaluateConversation = async (
    initialQuery: string,
    turns: ConversationTurn[]
  ): Promise<EvaluationResponse> => {
    const response = await apiFetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initialQuery, conversation: turns }),
    });

    if (!response.ok) {
      throw new Error("Failed to evaluate conversation");
    }

    return response.json();
  };

  // Handle initial query submission
  const handleSubmit = async (text?: string) => {
    const searchQuery = (text ?? query).trim();
    if (!searchQuery) return;

    setLoading(true);

    try {
      const evaluation = await evaluateConversation(searchQuery, []);

      if (evaluation.ready) {
        // Already have enough info - go straight to results
        navigateToResults(searchQuery, [], evaluation.summary);
      } else {
        // Start the conversation
        setConversation({
          initialQuery: searchQuery,
          turns: [],
          currentQuestion: evaluation.nextQuestion || "Tell me more about what you're looking for?",
          isReady: false,
        });
        setQuery("");
      }
    } catch (error) {
      console.error("Error:", error);
      // Fallback: navigate directly to results if API fails
      navigate(`/results?q=${encodeURIComponent(searchQuery)}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle answer submission and get next question
  const handleAnswerSubmit = async () => {
    if (!conversation || !currentAnswer.trim()) return;

    setLoading(true);

    try {
      // Add the new turn to conversation
      const newTurn: ConversationTurn = {
        question: conversation.currentQuestion,
        answer: currentAnswer.trim(),
      };
      const newTurns = [...conversation.turns, newTurn];

      // Check if we've hit the hard limit
      if (newTurns.length >= MAX_QUESTIONS) {
        // Force proceed to results
        navigateToResults(
          conversation.initialQuery,
          newTurns,
          "I think I have enough to work with! Let me find some great options for you."
        );
        return;
      }

      // Evaluate the conversation
      const evaluation = await evaluateConversation(conversation.initialQuery, newTurns);

      if (evaluation.ready) {
        // Ready to show results
        navigateToResults(conversation.initialQuery, newTurns, evaluation.summary);
      } else {
        // Continue the conversation
        setConversation({
          ...conversation,
          turns: newTurns,
          currentQuestion: evaluation.nextQuestion || "Anything else I should know?",
          isReady: false,
        });
        setCurrentAnswer("");
      }
    } catch (error) {
      console.error("Error:", error);
      // On error, proceed to results with what we have
      navigateToResults(
        conversation.initialQuery,
        [...conversation.turns, { question: conversation.currentQuestion, answer: currentAnswer.trim() }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Skip current question
  const handleSkipQuestion = async () => {
    if (!conversation) return;

    setLoading(true);

    try {
      // Add the skipped turn (empty answer)
      const newTurn: ConversationTurn = {
        question: conversation.currentQuestion,
        answer: "(skipped)",
      };
      const newTurns = [...conversation.turns, newTurn];

      // Check hard limit
      if (newTurns.length >= MAX_QUESTIONS) {
        navigateToResults(conversation.initialQuery, newTurns);
        return;
      }

      // Evaluate
      const evaluation = await evaluateConversation(conversation.initialQuery, newTurns);

      if (evaluation.ready) {
        navigateToResults(conversation.initialQuery, newTurns, evaluation.summary);
      } else {
        setConversation({
          ...conversation,
          turns: newTurns,
          currentQuestion: evaluation.nextQuestion || "What else should I know?",
        });
        setCurrentAnswer("");
      }
    } catch (error) {
      console.error("Error:", error);
      navigateToResults(conversation.initialQuery, conversation.turns);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to results with full context
  const navigateToResults = (
    initialQuery: string,
    turns: ConversationTurn[],
    summary?: string
  ) => {
    const contextString = buildContextString(initialQuery, turns, summary);
    navigate(`/results?q=${encodeURIComponent(contextString)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (conversation) {
        handleAnswerSubmit();
      } else {
        handleSubmit();
      }
    }
  };

  const handleStartOver = () => {
    setConversation(null);
    setCurrentAnswer("");
    setQuery("");
  };

  // Render the conversation/question flow
  if (conversation) {
    const questionNumber = conversation.turns.length + 1;

    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />

        <main className="max-w-3xl mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-24">
          {/* Header with question count */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-sm text-slate-500">
                  Question {questionNumber}
                  {questionNumber >= MAX_QUESTIONS - 1 && (
                    <span className="text-amber-600 ml-2">(almost done!)</span>
                  )}
                </span>
              </div>
              <button
                onClick={handleStartOver}
                className="text-sm text-slate-500 hover:text-primary transition-colors"
              >
                Start over
              </button>
            </div>
            {/* Subtle progress indicator */}
            <div className="h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-mauve to-cyan-light transition-all duration-500"
                style={{ width: `${Math.min((questionNumber / MAX_QUESTIONS) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Original query reminder */}
          <div className="glass-card p-4 mb-6 animate-fade-in">
            <p className="text-sm text-slate-500 mb-1">You're looking for:</p>
            <p className="text-primary font-medium">{conversation.initialQuery}</p>
          </div>

          {/* Previous Q&A - scrollable chat history */}
          {conversation.turns.length > 0 && (
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {conversation.turns.map((turn, idx) => (
                <div key={idx} className="animate-fade-in">
                  {/* Agent question bubble */}
                  <div className="flex gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img src={logoImg} alt="AutoMate" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                      <p className="text-sm text-slate-700">{turn.question}</p>
                    </div>
                  </div>
                  {/* User answer bubble */}
                  {turn.answer !== "(skipped)" && (
                    <div className="flex justify-end">
                      <div className="bg-gradient-to-r from-primary to-slate-700 text-white rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%]">
                        <p className="text-sm">{turn.answer}</p>
                      </div>
                    </div>
                  )}
                  {turn.answer === "(skipped)" && (
                    <div className="flex justify-end">
                      <div className="text-xs text-slate-400 italic px-4 py-2">Skipped</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Current question */}
          <div className="glass-card p-6 md:p-8 animate-slide-up">
            {/* Agent asking */}
            <div className="flex gap-4 mb-6">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img src={logoImg} alt="AutoMate" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-lg md:text-xl text-primary leading-relaxed">
                  {conversation.currentQuestion}
                </p>
              </div>
            </div>

            {/* User input */}
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer..."
              className="w-full bg-white/50 text-lg text-primary placeholder-slate-400 resize-none outline-none min-h-[80px] rounded-xl p-4 border border-slate-200/50 focus:border-mauve transition-colors"
              rows={3}
              autoFocus
              disabled={loading}
            />

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200/50">
              <button
                onClick={handleSkipQuestion}
                disabled={loading}
                className="text-sm text-slate-500 hover:text-primary transition-colors disabled:opacity-50"
              >
                Skip this one
              </button>
              <button
                onClick={handleAnswerSubmit}
                disabled={!currentAnswer.trim() || loading}
                className="px-6 py-3 bg-gradient-to-r from-mauve to-cyan-light text-primary font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Thinking...
                  </>
                ) : (
                  <>
                    Send
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Initial search view
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-white/50 shadow-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wide text-slate-600">
              AutoMate Agent · Ready
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 leading-tight">
            Tell us about your{" "}
            <span className="gradient-text">perfect car</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Describe your lifestyle, needs, and budget. Your AI agent will find the best matches and negotiate with dealers on your behalf.
          </p>
        </div>

        {/* Chat Input Card */}
        <div className="glass-card p-6 md:p-8 max-w-3xl mx-auto">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0">
              <img src={logoImg} alt="AutoMate" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500 mb-2">Tell your agent what you're looking for</p>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="I'm a mom of 4 and need a reliable SUV under $35k with great safety features..."
                className="w-full bg-transparent text-lg text-primary placeholder-slate-400 resize-none outline-none min-h-[120px]"
                rows={5}
                disabled={loading}
                autoFocus
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
            <p className="text-sm text-slate-500">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing your needs...
                </span>
              ) : (
                "Press Enter or click the button to start"
              )}
            </p>
            <button
              onClick={() => handleSubmit()}
              disabled={!query.trim() || loading}
              className="px-6 py-3 bg-gradient-to-r from-mauve to-cyan-light text-primary font-semibold rounded-2xl hover:shadow-lg hover:scale-105 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  Start Chat
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 mb-4">Or try one of these examples:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSubmit(suggestion)}
                disabled={loading}
                className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 bg-white/70 hover:bg-white hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5 border border-white/50 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:translate-y-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* How it works hint */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-primary font-semibold text-xs">1</div>
              <span>Describe your needs</span>
            </div>
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-primary font-semibold text-xs">2</div>
              <span>Quick back-and-forth</span>
            </div>
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-primary font-semibold text-xs">3</div>
              <span>Get personalized results</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

/**
 * Build a context string from the conversation for the results page
 */
function buildContextString(
  initialQuery: string,
  turns: ConversationTurn[],
  summary?: string
): string {
  let context = initialQuery;

  // Add conversation details
  const qaPairs = turns
    .filter(turn => turn.answer !== "(skipped)")
    .map(turn => `${turn.question} ${turn.answer}`);

  if (qaPairs.length > 0) {
    context += ". Additional details: " + qaPairs.join(". ");
  }

  // Add summary if provided
  if (summary) {
    context += `. Summary: ${summary}`;
  }

  return context;
}

