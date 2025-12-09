import { InsightsWidget } from "./InsightsWidget";
import { SpecsTable } from "./SpecsTable";
import { SafetyWidget } from "./SafetyWidget";

interface OverviewTabProps {
  data: {
    insights: {
      summary: string;
      pros: string[];
      cons: string[];
      commonIssues: string[];
      bestFor: string[];
      notIdealFor: string[];
      competitorComparison: string;
      buyingTips: string[];
      ownerSentiment: string;
      reliabilityScore: number;
    } | null;
    safety: {
      safety: {
        overallRating: string;
        frontalCrashRating: string;
        sideCrashRating: string;
        rolloverRating: string;
      } | null;
      recalls: Array<{
        campaignNumber: string;
        component: string;
        summary: string;
        remedy: string;
      }>;
      complaints: Array<{
        component: string;
        summary: string;
        crash: boolean;
      }>;
      recallCount: number;
      complaintCount: number;
    };
    marketStats: {
      averagePrice: number;
      medianPrice: number;
      minPrice: number;
      maxPrice: number;
      totalListings: number;
      averageMiles: number;
      averageDaysOnMarket: number;
    } | null;
    totalListings: number;
  };
  make: string;
  model: string;
  year: number;
}

export const OverviewTab = ({ data, make, model, year }: OverviewTabProps) => {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Key Features & Specs */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <span>🔧</span> Features & Specifications
          </h2>
          <SpecsTable make={make} model={model} year={year} />
        </div>

        {/* Insights */}
        {data.insights && <InsightsWidget insights={data.insights} />}
        
        {/* Safety Overview (Summary) */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <span>🛡️</span> Safety Summary
          </h2>
          
          {data.safety.safety ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold gradient-text">{data.safety.safety.overallRating}</p>
                <p className="text-sm text-slate-500">Overall</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">{data.safety.safety.frontalCrashRating}</p>
                <p className="text-sm text-slate-500">Frontal</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-purple-600">{data.safety.safety.sideCrashRating}</p>
                <p className="text-sm text-slate-500">Side</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-orange-600">{data.safety.safety.rolloverRating}</p>
                <p className="text-sm text-slate-500">Rollover</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 mb-4">Safety ratings not available for this vehicle.</p>
          )}

          <div className="flex gap-4">
            {data.safety.recallCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg">
                <span className="text-orange-500">⚠️</span>
                <span className="text-sm text-orange-700">{data.safety.recallCount} Active Recalls</span>
              </div>
            )}
            {data.safety.complaintCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg">
                <span className="text-red-500">📝</span>
                <span className="text-sm text-red-700">{data.safety.complaintCount} NHTSA Complaints</span>
              </div>
            )}
            {data.safety.recallCount === 0 && data.safety.complaintCount === 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                <span className="text-green-500">✓</span>
                <span className="text-sm text-green-700">No active recalls or major complaints</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Reliability Score */}
        {data.insights && (
          <div className="glass-card p-6">
            <h3 className="font-semibold text-primary mb-4">Reliability Score</h3>
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-4xl font-bold gradient-text">
                  {data.insights.reliabilityScore}/10
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-mauve to-cyan-light h-3 rounded-full transition-all duration-500"
                  style={{ width: `${data.insights.reliabilityScore * 10}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Based on owner reports and industry data
              </p>
            </div>
          </div>
        )}

        {/* Best For / Not Ideal For */}
        {data.insights && (
          <div className="glass-card p-6">
            <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
              <span className="text-green-500">✓</span> Best For
            </h3>
            <div className="space-y-2 mb-6">
              {data.insights.bestFor.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span className="text-slate-600">{item}</span>
                </div>
              ))}
            </div>
            
            <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
              <span className="text-red-500">✗</span> Not Ideal For
            </h3>
            <div className="space-y-2">
              {data.insights.notIdealFor.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span className="text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Competitor Comparison */}
        {data.insights?.competitorComparison && (
          <div className="glass-card p-6">
            <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
              <span>🆚</span> vs Competition
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {data.insights.competitorComparison}
            </p>
          </div>
        )}

        {/* Buying Tips */}
        {data.insights?.buyingTips && data.insights.buyingTips.length > 0 && (
          <div className="glass-card p-6 bg-gradient-to-br from-mauve/10 to-cyan-light/10">
            <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
              <span>💡</span> Buying Tips
            </h3>
            <div className="space-y-2">
              {data.insights.buyingTips.map((tip, i) => (
                <p key={i} className="text-sm text-slate-600">• {tip}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

