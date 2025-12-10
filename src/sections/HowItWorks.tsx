/**
 * HowItWorks - Visual explanation of the car-buying flow.
 * Purely presentational - no API calls or business logic changes.
 * This describes an existing flow, not a new workflow engine.
 */

const steps = [
  {
    number: 1,
    title: "Tell your agent how you live",
    description:
      "Share a quick brief: where you drive, who rides with you, whether you care more about payments, safety, or performance. Paste any listings you already have your eye on.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    gradient: "from-thistle to-mauve",
  },
  {
    number: 2,
    title: "AutoMate hunts, compares, and negotiates",
    description:
      "Your agent pulls in live listings, incentives, and market data, then negotiates with dealers on your behalf. You see distilled options with clear trade-offs — not sales scripts.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    gradient: "from-cyan-light to-sky-pale",
  },
  {
    number: 3,
    title: "You approve, we handle the paperwork",
    description:
      "Pick your favorite option. AutoMate coordinates contracts, financing, insurance, and delivery or pickup details — so the only thing left to do is show up.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    gradient: "from-lavender to-lavender-veil",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-accent uppercase bg-white/60 backdrop-blur-sm border border-white/50 mb-4">
            How it works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight">
            From "I think I need a car" to
            <br />
            <span className="gradient-text">"keys in hand"</span> in three steps.
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            AutoMate orchestrates the messy parts of car buying — finding the right fit, chasing
            dealers, comparing financing — so you never have to live in 20 open tabs again.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative group"
            >
              {/* Connector line (hidden on mobile, visible on md+) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-slate-200 to-transparent" />
              )}

              {/* Card */}
              <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 sm:p-8 hover:bg-white/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                {/* Step Badge */}
                <div className="flex items-center gap-3 mb-5">
                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${step.gradient} text-primary font-bold text-sm`}>
                    {step.number}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Step {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-bold text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {step.description}
                </p>

                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-lavender/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA hint */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Ready to skip the dealership drama?{" "}
            <a href="#cta" className="font-semibold text-accent hover:text-accent-hover transition-colors">
              Join the beta →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

