import { useEffect, useState } from "react";

/**
 * Static chat messages for the demo
 * This is purely presentational - no API calls
 */
const demoMessages = [
  {
    id: 1,
    role: "user" as const,
    text: "I'm a recent grad in SF. I want a safe, reliable hybrid under $28k with room for friends.",
  },
  {
    id: 2,
    role: "agent" as const,
    text: "Got it — I'll focus on compact hybrid SUVs with top safety ratings and low total cost of ownership. Do you prefer new or certified pre-owned?",
  },
  {
    id: 3,
    role: "user" as const,
    text: "Probably certified pre-owned if it saves money.",
  },
  {
    id: 4,
    role: "agent" as const,
    text: "Perfect. I'm comparing offers on RAV4 Hybrid, CR-V Hybrid, and Tucson Hybrid within 50 miles of SF, targeting all-in pricing under $28k. I'll negotiate with dealers and surface the best 3 options for you.",
  },
];

const suggestionChips = [
  "Find a first car under $15k",
  "I'm a new parent, need a safe SUV",
  "Help me trade in my old Civic",
];

/**
 * AgentDemo - A visually rich but fake chat demo for marketing purposes.
 * This component is self-contained and UI-only. No API calls.
 */
export const AgentDemo = () => {
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [showTyping, setShowTyping] = useState(false);

  // Staggered animation: reveal messages one by one
  useEffect(() => {
    if (visibleMessages < demoMessages.length) {
      const currentMessage = demoMessages[visibleMessages];
      const isAgentMessage = currentMessage?.role === "agent";
      
      // Show typing indicator before agent messages
      if (isAgentMessage && visibleMessages > 0) {
        setShowTyping(true);
        const typingTimer = setTimeout(() => {
          setShowTyping(false);
          setVisibleMessages((prev) => prev + 1);
        }, 1200);
        return () => clearTimeout(typingTimer);
      } else {
        const timer = setTimeout(() => {
          setVisibleMessages((prev) => prev + 1);
        }, visibleMessages === 0 ? 500 : 800);
        return () => clearTimeout(timer);
      }
    }
  }, [visibleMessages]);

  return (
    <div className="relative rounded-2xl border border-white/20 bg-white/80 backdrop-blur-xl p-4 sm:p-5 shadow-xl overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-lavender/10 via-transparent to-cyan-light/10 pointer-events-none" />
      
      {/* Top status row */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-slate-600">
            AutoMate Agent · <span className="text-emerald-600">Online</span>
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-gradient-to-r from-mauve/30 to-thistle/30 text-primary uppercase">
          Beta
        </span>
      </div>

      {/* Chat feed */}
      <div className="relative space-y-3 text-[11px] sm:text-xs max-h-[280px] overflow-y-auto pr-1">
        {demoMessages.slice(0, visibleMessages).map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-demo-message`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {message.role === "agent" && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-light to-mauve flex items-center justify-center flex-shrink-0 mr-2">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
                </svg>
              </div>
            )}
            <div
              className={`max-w-[85%] px-3 py-2 rounded-2xl leading-relaxed ${
                message.role === "user"
                  ? "bg-gradient-to-r from-primary to-slate-700 text-white rounded-br-md"
                  : "bg-white/90 text-slate-700 border border-slate-100 rounded-bl-md shadow-sm"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {showTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-light to-mauve flex items-center justify-center flex-shrink-0 mr-2">
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
              </svg>
            </div>
            <div className="bg-white/90 border border-slate-100 rounded-2xl rounded-bl-md px-4 py-2.5 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-typing-dot" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-typing-dot" style={{ animationDelay: "200ms" }}></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-typing-dot" style={{ animationDelay: "400ms" }}></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion chips */}
      <div className="relative mt-4 pt-3 border-t border-slate-100/50">
        <p className="text-[10px] text-slate-400 mb-2">Try asking:</p>
        <div className="flex flex-wrap gap-1.5">
          {suggestionChips.map((chip) => (
            <button
              key={chip}
              className="px-2.5 py-1.5 rounded-full text-[10px] font-medium text-slate-600 bg-white/70 hover:bg-white hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5 border border-slate-100/50 transition-all duration-200 active:scale-[0.98]"
              onClick={() => {}} // No-op: purely visual
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Fake input bar */}
      <div className="relative mt-3 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <input
            type="text"
            placeholder="Ask AutoMate anything about your next car..."
            className="flex-1 bg-transparent text-xs text-slate-500 placeholder-slate-400 outline-none cursor-not-allowed"
            disabled
          />
        </div>
        <button
          className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-mauve/50 to-cyan-light/50 text-slate-400 cursor-not-allowed opacity-60"
          disabled
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AgentDemo;

