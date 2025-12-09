import { useState } from "react";
import { NegotiationSnapshot } from "../types";

interface Props {
  negotiation: NegotiationSnapshot;
}

export const NegotiationSimulator = ({ negotiation }: Props) => {
  const [step, setStep] = useState(0);
  const [simulating, setSimulating] = useState(false);

  const { msrp, dealerInitial, autoMateCounter, dealerFinal } = negotiation;
  const savings = msrp - dealerFinal;

  const runSimulation = () => {
    setSimulating(true);
    setStep(1);
    
    setTimeout(() => setStep(2), 1000);
    setTimeout(() => setStep(3), 2000);
    setTimeout(() => {
      setStep(4);
      setSimulating(false);
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-bold text-primary">AI Negotiation</p>
        {step === 0 && (
          <button
            className="px-4 py-2 text-sm font-semibold text-primary bg-gradient-to-r from-mauve to-cyan-light rounded-xl hover:shadow-md transition-all"
            onClick={runSimulation}
          >
            Simulate negotiation
          </button>
        )}
      </div>

      {step >= 1 && (
        <div className="space-y-3">
          {/* Step 1: Dealer Initial */}
          <div className={`flex gap-3 items-start animate-slide-up ${step === 1 && simulating ? "opacity-100" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-rose-600">D</span>
            </div>
            <div className="flex-1 bg-rose-50 rounded-2xl rounded-tl-sm px-4 py-3">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Dealer:</span> Initial offer is{" "}
                <span className="font-bold text-rose-600">${dealerInitial.toLocaleString()}</span>
              </p>
            </div>
          </div>

          {/* Step 2: AutoMate Counter */}
          {step >= 2 && (
            <div className="flex gap-3 items-start animate-slide-up">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mauve to-thistle flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">A</span>
              </div>
              <div className="flex-1 bg-gradient-to-r from-thistle/30 to-mauve/30 rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-primary">AutoMate:</span> Based on market data, we counter at{" "}
                  <span className="font-bold text-primary">${autoMateCounter.toLocaleString()}</span>
                  {" "}— factoring in available incentives and fee analysis.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Dealer Final */}
          {step >= 3 && (
            <div className="flex gap-3 items-start animate-slide-up">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-emerald-600">D</span>
              </div>
              <div className="flex-1 bg-emerald-50 rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Dealer:</span> Final offer accepted at{" "}
                  <span className="font-bold text-emerald-600">${dealerFinal.toLocaleString()}</span>
                </p>
              </div>
            </div>
          )}

          {/* Results Table */}
          {step >= 4 && (
            <div className="mt-4 animate-fade-in">
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-lavender-veil/50 to-cyan-light/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-slate-600 font-semibold">MSRP</th>
                      <th className="px-4 py-3 text-left text-slate-600 font-semibold">Dealer Initial</th>
                      <th className="px-4 py-3 text-left text-slate-600 font-semibold">Final Price</th>
                      <th className="px-4 py-3 text-left text-emerald-600 font-semibold">You Save</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3 text-slate-700">${msrp.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-700">${dealerInitial.toLocaleString()}</td>
                      <td className="px-4 py-3 font-bold text-primary">${dealerFinal.toLocaleString()}</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">
                        ${savings.toLocaleString()} 🎉
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                (Simulated negotiation for demo purposes)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
