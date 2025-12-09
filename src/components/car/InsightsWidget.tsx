interface InsightsProps {
  insights: {
    summary: string;
    pros: string[];
    cons: string[];
    commonIssues: string[];
    competitorComparison: string;
    buyingTips: string[];
    ownerSentiment: string;
    reliabilityScore: number;
  };
}

export const InsightsWidget = ({ insights }: InsightsProps) => {
  return (
    <div className="space-y-6">
      {/* Pros & Cons */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
          <span>💬</span> What Owners Say
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pros */}
          <div>
            <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-sm">👍</span>
              Pros
            </h4>
            <ul className="space-y-2">
              {insights.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Cons */}
          <div>
            <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-sm">👎</span>
              Cons
            </h4>
            <ul className="space-y-2">
              {insights.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-red-500 mt-0.5">✗</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Common Issues */}
      {insights.commonIssues.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <span>⚠️</span> Known Issues to Watch For
          </h3>
          <ul className="space-y-3">
            {insights.commonIssues.map((issue, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 text-xs font-medium">
                  {i + 1}
                </span>
                <span className="text-slate-600">{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Competitor Comparison */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
          <span>⚔️</span> vs. Competition
        </h3>
        <p className="text-slate-600 leading-relaxed">{insights.competitorComparison}</p>
      </div>

      {/* Buying Tips */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
          <span>💡</span> Buying Tips
        </h3>
        <ul className="space-y-3">
          {insights.buyingTips.map((tip, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-mauve/20 to-cyan-light/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-medium">
                {i + 1}
              </span>
              <span className="text-slate-600 text-sm">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

