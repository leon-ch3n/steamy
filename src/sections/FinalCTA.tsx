import { useState } from "react";

/**
 * FinalCTA - Final call-to-action section with email capture.
 * Front-end only UI - uses existing waitlist logic if available.
 */

export const FinalCTA = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    // Simulate submission - replace with real endpoint if one exists
    // This is front-end only for now per requirements
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    setEmail("");
  };

  return (
    <section id="cta" className="py-16 sm:py-24 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Soft intro line */}
        <p className="text-sm font-medium text-slate-500 mb-4">
          Join early shoppers who are done fighting with dealerships alone.
        </p>

        {/* Main heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight">
          Be one of the first to hand
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>car buying to an{" "}
          <span className="gradient-text">AI agent.</span>
        </h2>

        {/* Description */}
        <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          We're onboarding our private beta in waves to keep every conversation fast and
          human-grade. Tell us what you're shopping for and we'll reserve your spot.
        </p>

        {/* Email capture form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 px-5 py-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 text-primary placeholder-slate-400 outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="px-6 sm:px-8 py-4 rounded-2xl text-sm sm:text-base font-semibold bg-gradient-to-r from-mauve to-cyan-light text-primary hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Joining...
                  </>
                ) : (
                  "Join the waitlist"
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              No spam. Just updates when we're ready to help you find your next car.
            </p>
          </form>
        ) : (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-light flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">You're on the list!</h3>
            <p className="text-slate-600 text-sm">
              We'll reach out when it's your turn. In the meantime, feel free to explore
              or tell us more about what you're looking for.
            </p>
          </div>
        )}

        {/* Trust indicators */}
        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>No credit card</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Private beta</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;

