/**
 * WhyAutoMate - Marketing section explaining the value proposition.
 * Purely presentational - no API calls or business logic.
 */

const features = [
  {
    title: "End-to-end automation",
    description:
      "From your first question to your final short list, AutoMate does the heavy lifting on research: it understands your constraints, scans the market, scores options, and explains its picks step-by-step.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
    gradient: "from-thistle to-mauve",
  },
  {
    title: "Price intelligence, not guesswork",
    description:
      "AutoMate compares listings, incentives, and pricing patterns across platforms to show you what's typical, what's high, and where the real value is. It surfaces the best all-in offers for you, including cars from dealers we don't get paid by.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    gradient: "from-cyan-light to-sky-pale",
  },
  {
    title: "Built for real life, not spec sheets",
    description:
      "Describe your life — your commute, budget, who's riding with you, what stresses you out about buying — and AutoMate translates that into concrete car recommendations, side-by-side comparisons, and next steps.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    gradient: "from-lavender to-lavender-veil",
  },
];

export const WhyAutoMate = () => {
  return (
    <section className="py-16 sm:py-20 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-accent uppercase bg-white/40 backdrop-blur-2xl border border-white/60 mb-4" style={{ boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.4)' }}>
            Why AutoMate
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight">
            Car buying that finally works
            <br />
            <span className="gradient-text">for you, not the system.</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            AutoMate is the first AI-powered buying agent that handles the car-purchase workflow on your behalf, from search to test drive & negotiation, using real market data, real dealer outreach, and real automation. No lead forms. No sales pressure. Just outcomes.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-8 grid gap-4 sm:gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-white/40 backdrop-blur-2xl rounded-2xl border border-white/60 p-6 sm:p-8 hover:bg-white/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              style={{ 
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.4)',
                animationDelay: `${index * 0.1}s` 
              }}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {feature.description}
              </p>

              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-lavender/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyAutoMate;

