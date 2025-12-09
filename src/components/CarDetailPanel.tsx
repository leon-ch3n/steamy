import { FormEvent, useState } from "react";
import { Car } from "../types";
import { NegotiationSimulator } from "./NegotiationSimulator";

interface Props {
  car: Car | null;
  onClose: () => void;
}

export const CarDetailPanel = ({ car, onClose }: Props) => {
  const [nextStep, setNextStep] = useState("Schedule a test drive");
  const [toast, setToast] = useState("");

  if (!car) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setToast("We've locked this in your AutoMate queue (demo only).");
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20"
        onClick={onClose}
      />
      
      {/* Panel */}
      <aside className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-white/95 backdrop-blur-xl shadow-2xl z-30 flex flex-col animate-slide-in-right">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <div>
            <p className="text-xs uppercase text-primary/70 font-semibold tracking-wide">Research hub</p>
            <p className="text-xl font-bold text-primary">{car.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {/* Summary */}
          <div className="glass-card p-5 space-y-2">
            <p className="text-xs uppercase text-primary/70 font-semibold tracking-wide">AutoMate summary</p>
            <p className="text-primary leading-relaxed">{car.summary}</p>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-4 space-y-3">
              <p className="text-sm font-bold text-primary flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">✓</span>
                Pros
              </p>
              <ul className="text-sm text-slate-600 space-y-2">
                {car.pros.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card p-4 space-y-3">
              <p className="text-sm font-bold text-primary flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-xs">✗</span>
                Cons
              </p>
              <ul className="text-sm text-slate-600 space-y-2">
                {car.cons.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Listings */}
          <div className="glass-card p-5 space-y-3">
            <p className="text-sm font-bold text-primary">Listing snapshot</p>
            <div className="flex flex-col gap-2">
              {car.listings.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  className="text-sm text-primary hover:underline flex items-center gap-2"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Title History */}
          <div className="glass-card p-5 space-y-2">
            <p className="text-sm font-bold text-primary">Title & history</p>
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {car.titleHistory}
            </div>
          </div>

          {/* Financing */}
          <div className="glass-card p-5 space-y-3">
            <p className="text-sm font-bold text-primary">Financing snapshot</p>
            <div className="flex flex-col gap-2">
              {car.financing.map((item) => (
                <div
                  key={item.downPayment}
                  className="flex justify-between items-center text-sm bg-gradient-to-r from-lavender-veil/30 to-cyan-light/30 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="font-bold text-primary">{item.monthly}</p>
                    <p className="text-slate-500 text-xs">
                      {item.term} • {item.apr}
                    </p>
                  </div>
                  <p className="text-slate-600 text-sm">Down: {item.downPayment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Negotiation */}
          <div className="glass-card p-5">
            <NegotiationSimulator negotiation={car.negotiation} />
          </div>

          {/* Next Steps */}
          <div className="glass-card p-5 space-y-4">
            <div>
              <p className="text-sm font-bold text-primary">Next steps</p>
              <p className="text-sm text-slate-600">Queue a test drive or save this search.</p>
            </div>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-3">
                <input
                  className="rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  placeholder="Name"
                  required
                />
                <input
                  className="rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  placeholder="Email"
                  type="email"
                  required
                />
                <input
                  className="rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  placeholder="Zip code"
                  required
                />
                <select
                  value={nextStep}
                  onChange={(e) => setNextStep(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                >
                  <option>Schedule a test drive</option>
                  <option>Get pre-approved</option>
                  <option>Save this search</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-mauve to-cyan-light text-primary rounded-xl py-3.5 font-semibold text-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                Confirm ({nextStep})
              </button>
            </form>
            {toast && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2 animate-fade-in">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {toast}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
