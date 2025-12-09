import { useState, useMemo } from "react";

interface FinancingCalculatorProps {
  averagePrice: number;
  make: string;
  model: string;
  year: number;
}

export const FinancingCalculator = ({ averagePrice, make, model, year }: FinancingCalculatorProps) => {
  const [vehiclePrice, setVehiclePrice] = useState(averagePrice);
  const [downPayment, setDownPayment] = useState(Math.round(averagePrice * 0.2));
  const [tradeInValue, setTradeInValue] = useState(0);
  const [loanTerm, setLoanTerm] = useState(60); // months
  const [interestRate, setInterestRate] = useState(6.5);
  const [creditScore, setCreditScore] = useState<"excellent" | "good" | "fair" | "poor">("good");

  // Interest rate suggestions based on credit score
  const suggestedRates = {
    excellent: { min: 4.5, max: 5.5, label: "720+" },
    good: { min: 5.5, max: 7.5, label: "680-719" },
    fair: { min: 8.0, max: 12.0, label: "620-679" },
    poor: { min: 12.0, max: 18.0, label: "Below 620" },
  };

  // Calculate loan details
  const calculations = useMemo(() => {
    const principal = vehiclePrice - downPayment - tradeInValue;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm;

    // Monthly payment formula: P * (r(1+r)^n) / ((1+r)^n - 1)
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
      monthlyPayment = principal / numPayments;
    }

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principal;

    // Estimate taxes and fees (~10% of vehicle price)
    const estimatedTaxesAndFees = vehiclePrice * 0.1;

    return {
      principal: Math.max(0, principal),
      monthlyPayment: Math.max(0, monthlyPayment),
      totalPayment: Math.max(0, totalPayment),
      totalInterest: Math.max(0, totalInterest),
      estimatedTaxesAndFees,
      totalCost: vehiclePrice + estimatedTaxesAndFees + totalInterest - tradeInValue,
    };
  }, [vehiclePrice, downPayment, tradeInValue, loanTerm, interestRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCreditScoreChange = (score: typeof creditScore) => {
    setCreditScore(score);
    setInterestRate(suggestedRates[score].min);
  };

  return (
    <div className="space-y-6">
      {/* Calculator Card */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
          <span>💰</span> Financing Calculator
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Estimate your monthly payments for the {year} {make} {model}
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Vehicle Price */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Vehicle Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 bg-white/50 text-primary focus:outline-none focus:border-mauve"
                />
              </div>
            </div>

            {/* Down Payment */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Down Payment
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 bg-white/50 text-primary focus:outline-none focus:border-mauve"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[10, 15, 20, 25].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setDownPayment(Math.round(vehiclePrice * (pct / 100)))}
                    className={`px-3 py-1 text-xs rounded-lg transition-all ${
                      Math.abs(downPayment - vehiclePrice * (pct / 100)) < 100
                        ? "bg-mauve text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Trade-in Value */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Trade-in Value (optional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  value={tradeInValue}
                  onChange={(e) => setTradeInValue(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 bg-white/50 text-primary focus:outline-none focus:border-mauve"
                />
              </div>
            </div>

            {/* Loan Term */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Loan Term
              </label>
              <div className="flex gap-2">
                {[36, 48, 60, 72, 84].map((months) => (
                  <button
                    key={months}
                    onClick={() => setLoanTerm(months)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                      loanTerm === months
                        ? "bg-gradient-to-r from-mauve to-cyan-light text-white shadow-md"
                        : "bg-white/50 text-slate-600 hover:bg-white"
                    }`}
                  >
                    {months} mo
                  </button>
                ))}
              </div>
            </div>

            {/* Credit Score */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Credit Score Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(suggestedRates) as Array<keyof typeof suggestedRates>).map((score) => (
                  <button
                    key={score}
                    onClick={() => handleCreditScoreChange(score)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      creditScore === score
                        ? "bg-gradient-to-r from-mauve to-cyan-light text-white shadow-md"
                        : "bg-white/50 text-slate-600 hover:bg-white"
                    }`}
                  >
                    <span className="block capitalize">{score}</span>
                    <span className="text-xs opacity-75">{suggestedRates[score].label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Interest Rate (APR): {interestRate.toFixed(1)}%
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-mauve"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0%</span>
                <span>10%</span>
                <span>20%</span>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Monthly Payment Highlight */}
            <div className="bg-gradient-to-br from-mauve/10 to-cyan-light/10 rounded-2xl p-6 text-center">
              <p className="text-sm text-slate-500 mb-1">Estimated Monthly Payment</p>
              <p className="text-5xl font-bold gradient-text mb-2">
                {formatCurrency(calculations.monthlyPayment)}
              </p>
              <p className="text-sm text-slate-500">
                for {loanTerm} months at {interestRate.toFixed(1)}% APR
              </p>
            </div>

            {/* Breakdown */}
            <div className="bg-white/50 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-primary">Payment Breakdown</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Vehicle Price</span>
                  <span className="font-medium">{formatCurrency(vehiclePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Down Payment</span>
                  <span className="font-medium text-green-600">-{formatCurrency(downPayment)}</span>
                </div>
                {tradeInValue > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Trade-in Value</span>
                    <span className="font-medium text-green-600">-{formatCurrency(tradeInValue)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-600">Amount Financed</span>
                  <span className="font-medium">{formatCurrency(calculations.principal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Interest</span>
                  <span className="font-medium text-orange-600">+{formatCurrency(calculations.totalInterest)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Est. Taxes & Fees</span>
                  <span className="font-medium">~{formatCurrency(calculations.estimatedTaxesAndFees)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="font-semibold text-primary">Total Cost</span>
                  <span className="font-bold gradient-text">{formatCurrency(calculations.totalCost)}</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <span>💡</span> Tips to Save Money
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• A larger down payment reduces your monthly payment and total interest</li>
                <li>• Shorter loan terms have lower interest rates</li>
                <li>• Shop around for rates from banks, credit unions, and the dealer</li>
                <li>• Consider getting pre-approved before visiting the dealer</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Approval CTA */}
      <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-primary mb-1">Ready to get pre-approved?</h3>
          <p className="text-sm text-slate-600">
            Getting pre-approved gives you negotiating power at the dealership.
          </p>
        </div>
        <button
          onClick={() => alert("Pre-approval feature coming soon!")}
          className="px-6 py-3 bg-gradient-to-r from-mauve to-cyan-light text-white font-semibold rounded-xl hover:shadow-lg transition-all whitespace-nowrap"
        >
          Get Pre-Approved
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 text-center">
        * This calculator provides estimates only. Actual rates, terms, and amounts may vary based on your credit profile, lender, and other factors. Taxes and fees are estimated at 10% and may differ by state.
      </p>
    </div>
  );
};

