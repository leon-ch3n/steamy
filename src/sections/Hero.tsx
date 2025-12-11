import { ReactNode } from "react";

interface HeroProps {
  /** Interactive content area (e.g., search input, demo) */
  children?: ReactNode;
  /** Callback for primary CTA */
  onPrimaryCTA?: () => void;
  /** Callback for secondary CTA */
  onSecondaryCTA?: () => void;
}

/**
 * Hero section with premium layout.
 * Accepts children for the interactive content area (search, demo, etc.)
 */
export const Hero = ({ children, onPrimaryCTA, onSecondaryCTA }: HeroProps) => {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
          {/* Left column - Copy */}
          <div className="text-center lg:text-left animate-fade-in">
            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-white/50 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-light opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
                AI Car-Buying Agent
              </span>
            </div>
            
            {/* Main headline */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-[1.1] tracking-tight">
              Your AI car-buying
              <br className="hidden xs:block" />
              <span className="xs:hidden"> </span>agent.{" "}
              <span className="gradient-text">End-to-end.</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              AutoMate makes car buying effortless: it finds the right car, explains every tradeoff, and guides you through the decision from start to finish.
              <br /><br />
              <span className="text-primary font-medium">You describe your life. Your agent handles the rest.</span>
            </p>
            
            {/* CTA */}
            <div className="flex justify-center lg:justify-start mb-8">
              <button
                onClick={onPrimaryCTA}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-semibold bg-gradient-to-r from-mauve to-cyan-light text-primary hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get early access
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
            
            <p className="text-[11px] sm:text-xs text-slate-400 text-center lg:text-left">
              Your AI car-buying expert, finally on your side.
            </p>
          </div>
          
          {/* Right column - Interactive content */}
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

