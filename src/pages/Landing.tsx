import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";

const suggestions = [
  "I'm a mom of 4 and need a reliable SUV under $35k",
  "First EV under $40k with good range",
  "Sporty sedan for a new grad under $30k",
  "Best family car for road trips",
];

interface ConversationState {
  initialQuery: string;
  questions: string[];
  answers: string[];
  currentQuestionIndex: number;
}

export const Landing = () => {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState<ConversationState | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (text?: string) => {
    const searchQuery = (text ?? query).trim();
    if (!searchQuery) return;

    setLoading(true);
    
    try {
      const response = await fetch("/api/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) throw new Error("Failed to get follow-up questions");

      const data = await response.json();
      
      setConversation({
        initialQuery: searchQuery,
        questions: data.questions,
        answers: [],
        currentQuestionIndex: 0,
      });
      setQuery("");
    } catch (error) {
      console.error("Error:", error);
      // Fallback: navigate directly to results if API fails
      navigate(`/results?q=${encodeURIComponent(searchQuery)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = () => {
    if (!conversation || !currentAnswer.trim()) return;

    const newAnswers = [...conversation.answers, currentAnswer.trim()];
    const nextIndex = conversation.currentQuestionIndex + 1;

    if (nextIndex >= conversation.questions.length) {
      // All questions answered, navigate to results with full context
      const fullContext = buildContextString(
        conversation.initialQuery,
        conversation.questions,
        newAnswers
      );
      navigate(`/results?q=${encodeURIComponent(fullContext)}`);
    } else {
      setConversation({
        ...conversation,
        answers: newAnswers,
        currentQuestionIndex: nextIndex,
      });
      setCurrentAnswer("");
    }
  };

  const handleSkipQuestion = () => {
    if (!conversation) return;

    const newAnswers = [...conversation.answers, ""];
    const nextIndex = conversation.currentQuestionIndex + 1;

    if (nextIndex >= conversation.questions.length) {
      const fullContext = buildContextString(
        conversation.initialQuery,
        conversation.questions,
        newAnswers
      );
      navigate(`/results?q=${encodeURIComponent(fullContext)}`);
    } else {
      setConversation({
        ...conversation,
        answers: newAnswers,
        currentQuestionIndex: nextIndex,
      });
      setCurrentAnswer("");
    }
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
    const currentQuestion = conversation.questions[conversation.currentQuestionIndex];
    const progress = ((conversation.currentQuestionIndex + 1) / conversation.questions.length) * 100;

    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        
        <main className="max-w-3xl mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-24">
          {/* Progress indicator */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">
                Question {conversation.currentQuestionIndex + 1} of {conversation.questions.length}
              </span>
              <button
                onClick={handleStartOver}
                className="text-sm text-slate-500 hover:text-primary transition-colors"
              >
                Start over
              </button>
            </div>
            <div className="h-2 bg-white/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-mauve to-cyan-light transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Original query reminder */}
          <div className="glass-card p-4 mb-6 animate-fade-in">
            <p className="text-sm text-slate-500 mb-1">Your search:</p>
            <p className="text-primary font-medium">{conversation.initialQuery}</p>
          </div>

          {/* Previous Q&A */}
          {conversation.answers.length > 0 && (
            <div className="space-y-4 mb-6">
              {conversation.answers.map((answer, idx) => (
                <div key={idx} className="animate-fade-in">
                  <div className="glass-card p-4 mb-2">
                    <p className="text-sm text-slate-500 mb-1">Q{idx + 1}:</p>
                    <p className="text-primary">{conversation.questions[idx]}</p>
                  </div>
                  {answer && (
                    <div className="ml-4 p-3 bg-gradient-to-r from-mauve/20 to-thistle/20 rounded-xl">
                      <p className="text-primary text-sm">{answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Current question */}
          <div className="glass-card p-6 md:p-8 animate-slide-up">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-mauve to-thistle flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xl md:text-2xl font-semibold text-primary leading-relaxed">
                  {currentQuestion}
                </p>
              </div>
            </div>

            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer..."
              className="w-full bg-white/50 text-lg text-primary placeholder-slate-400 resize-none outline-none min-h-[80px] rounded-xl p-4 border border-slate-200/50 focus:border-mauve transition-colors"
              rows={3}
              autoFocus
            />

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200/50">
              <button
                onClick={handleSkipQuestion}
                className="text-sm text-slate-500 hover:text-primary transition-colors"
              >
                Skip this question
              </button>
              <button
                onClick={handleAnswerSubmit}
                disabled={!currentAnswer.trim()}
                className="px-6 py-3 bg-gradient-to-r from-mauve to-cyan-light text-primary font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {conversation.currentQuestionIndex === conversation.questions.length - 1
                  ? "Find My Car"
                  : "Next"}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Initial landing view
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 md:px-8 pt-12 md:pt-24 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight">
            Find your perfect car
            <br />
            <span className="gradient-text">without the hassle</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
            Tell us what you need. Our AI handles the research, negotiation, and paperwork.
          </p>
        </div>

        {/* Chat Input */}
        <div className="glass-card p-6 md:p-8 max-w-3xl mx-auto animate-slide-up">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-mauve to-thistle flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="flex-1">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your ideal car... What's your budget? What features matter most?"
                className="w-full bg-transparent text-lg text-primary placeholder-slate-400 resize-none outline-none min-h-[80px]"
                rows={3}
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200/50">
            <p className="text-sm text-slate-500">
              {loading ? "Analyzing your needs..." : "Press Enter to search"}
            </p>
            <button
              onClick={() => handleSubmit()}
              disabled={!query.trim() || loading}
              className="px-6 py-3 bg-gradient-to-r from-mauve to-cyan-light text-primary font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
            >
              {loading && (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              Find My Car
            </button>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-3 justify-center mt-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSubmit(suggestion)}
              disabled={loading}
              className="px-5 py-2.5 glass-card text-sm font-medium text-slate-700 hover:bg-white/90 hover:shadow-md transition-all duration-200 disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-thistle to-mauve flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Smart Search</h3>
            <p className="text-slate-600">Describe what you need in plain English. Our AI understands context.</p>
          </div>

          <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-light to-sky-pale flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">AI Negotiator</h3>
            <p className="text-slate-600">We negotiate with dealers automatically to get you the best price.</p>
          </div>

          <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-lavender to-lavender-veil flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Complete Service</h3>
            <p className="text-slate-600">Insurance, financing, and delivery—all handled in one place.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

function buildContextString(
  initialQuery: string,
  questions: string[],
  answers: string[]
): string {
  let context = initialQuery;
  
  const qaPairs = questions
    .map((q, i) => {
      const answer = answers[i];
      if (answer) {
        return `${q} ${answer}`;
      }
      return null;
    })
    .filter(Boolean);

  if (qaPairs.length > 0) {
    context += ". Additional details: " + qaPairs.join(". ");
  }

  return context;
}
