import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";

const steps = [
  {
    number: "01",
    title: "Tell us what you need",
    description:
      "Describe your ideal car in plain English. Budget, features, lifestyle, we understand context. No forms, no filters, just conversation.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    gradient: "from-thistle to-mauve",
  },
  {
    number: "02",
    title: "AI finds your matches",
    description:
      "Our agent scans thousands of listings, analyzes reviews, compares prices, and identifies the best options for your specific needs.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    gradient: "from-cyan-light to-sky-pale",
  },
  {
    number: "03",
    title: "We prepare you to negotiate",
    description:
      "AutoMate shares the best negotiation practices ahead of time so you walk in confident and informed. We don't negotiate for you—we make sure you're ready to get the best deal yourself.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    gradient: "from-lavender to-lavender-veil",
  },
  {
    number: "04",
    title: "Complete the deal",
    description:
      "Schedule your test drive and we'll walk you through your next steps!",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-thistle-alt to-thistle",
  },
];

export const HowItWorks = () => {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-24">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            How <span className="gradient-text">AutoMate</span> Works
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            We've reimagined car buying for a generation that values time, transparency, and simplicity.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="glass-card p-8 md:p-10 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.gradient} flex items-center justify-center flex-shrink-0 text-primary`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-sm font-mono text-primary/60">{step.number}</span>
                    <h3 className="text-2xl font-bold text-primary">{step.title}</h3>
                  </div>
                  <p className="text-lg text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-mauve to-cyan-light text-primary font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Try AutoMate Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
};

