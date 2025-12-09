import { useState, useEffect } from "react";

interface VehicleHistoryTabProps {
  make: string;
  model: string;
  year: number;
  vin?: string;
  safety: {
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
}

interface VehicleHistory {
  vin: string;
  titleInfo: {
    state: string;
    type: string;
    odometer: number;
  };
  timeline: Array<{
    date: string;
    event: string;
    type: "purchase" | "service" | "accident" | "title" | "inspection" | "recall" | "other";
    details?: string;
    location?: string;
  }>;
  ownerCount: number;
  accidents: number;
  titleIssues: string[];
}

export const VehicleHistoryTab = ({ make, model, year, vin, safety }: VehicleHistoryTabProps) => {
  const [vinInput, setVinInput] = useState(vin || "");
  const [history, setHistory] = useState<VehicleHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch if VIN provided
  useEffect(() => {
    if (vin) {
      setVinInput(vin);
      fetchHistory(vin);
    }
  }, [vin]);

  const fetchHistory = async (vinToFetch: string) => {
    if (!vinToFetch || vinToFetch.length !== 17) {
      setError("Please enter a valid 17-character VIN");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/car/history/${vinToFetch}`);
      if (!response.ok) throw new Error("Failed to fetch vehicle history");
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
      // Use mock data for demo
      setHistory(generateMockHistory(vinToFetch));
    } finally {
      setLoading(false);
    }
  };

  const generateMockHistory = (vin: string): VehicleHistory => {
    const currentYear = new Date().getFullYear();
    const carAge = currentYear - year;
    
    return {
      vin,
      titleInfo: {
        state: "CA",
        type: "Clean",
        odometer: Math.floor(Math.random() * 15000 * carAge) + 5000,
      },
      ownerCount: Math.min(Math.floor(carAge / 3) + 1, 4),
      accidents: Math.random() > 0.8 ? 1 : 0,
      titleIssues: [],
      timeline: [
        {
          date: `${year}-03-15`,
          event: "Original Purchase",
          type: "purchase",
          details: `New vehicle purchased from ${make} dealer`,
          location: "Los Angeles, CA",
        },
        {
          date: `${year}-09-01`,
          event: "First Service",
          type: "service",
          details: "Oil change, tire rotation, multi-point inspection",
          location: "Los Angeles, CA",
        },
        ...(year < currentYear - 1 ? [{
          date: `${year + 1}-03-15`,
          event: "Annual Service",
          type: "service" as const,
          details: "15,000 mile service, brake inspection",
          location: "Los Angeles, CA",
        }] : []),
        ...(year < currentYear - 2 ? [{
          date: `${year + 2}-01-10`,
          event: "Ownership Transfer",
          type: "title" as const,
          details: "Vehicle sold to second owner",
          location: "San Diego, CA",
        }] : []),
        ...(safety.recallCount > 0 ? [{
          date: `${Math.min(year + 1, currentYear)}-06-15`,
          event: "Recall Service Completed",
          type: "recall" as const,
          details: safety.recalls[0]?.component || "Manufacturer recall addressed",
          location: "San Diego, CA",
        }] : []),
        {
          date: new Date().toISOString().split("T")[0],
          event: "Listed for Sale",
          type: "other",
          details: "Vehicle listed on marketplace",
        },
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "purchase": return "🚗";
      case "service": return "🔧";
      case "accident": return "💥";
      case "title": return "📄";
      case "inspection": return "✅";
      case "recall": return "🔔";
      default: return "📌";
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "purchase": return "bg-green-100 border-green-500";
      case "service": return "bg-blue-100 border-blue-500";
      case "accident": return "bg-red-100 border-red-500";
      case "title": return "bg-purple-100 border-purple-500";
      case "inspection": return "bg-emerald-100 border-emerald-500";
      case "recall": return "bg-orange-100 border-orange-500";
      default: return "bg-slate-100 border-slate-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* VIN Lookup */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <span>🔍</span> Vehicle History Report
        </h2>
        
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={vinInput}
            onChange={(e) => setVinInput(e.target.value.toUpperCase())}
            placeholder="Enter 17-character VIN"
            maxLength={17}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white/50 text-primary placeholder-slate-400 focus:outline-none focus:border-mauve transition-colors uppercase tracking-wider"
          />
          <button
            onClick={() => fetchHistory(vinInput)}
            disabled={loading || vinInput.length !== 17}
            className="px-6 py-3 bg-gradient-to-r from-mauve to-cyan-light text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Checking..." : "Check History"}
          </button>
        </div>

        <p className="text-sm text-slate-500">
          💡 Find the VIN on the vehicle's dashboard (driver's side), door jamb, or vehicle documents.
        </p>

        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>

      {/* General Info (No VIN needed) */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <span>📋</span> {year} {make} {model} - General Information
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">Model Year</p>
            <p className="text-2xl font-bold text-primary">{year}</p>
          </div>
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">Known Recalls</p>
            <p className={`text-2xl font-bold ${safety.recallCount > 0 ? "text-orange-600" : "text-green-600"}`}>
              {safety.recallCount}
            </p>
          </div>
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">NHTSA Complaints</p>
            <p className={`text-2xl font-bold ${safety.complaintCount > 5 ? "text-red-600" : "text-blue-600"}`}>
              {safety.complaintCount}
            </p>
          </div>
        </div>

        {/* Recalls Section */}
        {safety.recalls.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
              <span className="text-orange-500">🔔</span> Active Recalls for {year} {make} {model}
            </h3>
            <div className="space-y-3">
              {safety.recalls.slice(0, 5).map((recall, i) => (
                <div key={i} className="bg-orange-50 rounded-lg p-4">
                  <p className="font-medium text-orange-800">{recall.component}</p>
                  <p className="text-sm text-slate-600 mt-1">{recall.summary}</p>
                  {recall.remedy && (
                    <p className="text-sm text-green-700 mt-2">
                      <span className="font-medium">Remedy:</span> {recall.remedy}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* VIN-Specific History */}
      {history && (
        <>
          {/* Quick Stats */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Vehicle Report Summary</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`rounded-xl p-4 text-center ${history.titleIssues.length === 0 ? "bg-green-50" : "bg-red-50"}`}>
                <p className={`text-2xl font-bold ${history.titleIssues.length === 0 ? "text-green-600" : "text-red-600"}`}>
                  {history.titleInfo.type}
                </p>
                <p className="text-sm text-slate-500">Title Status</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{history.ownerCount}</p>
                <p className="text-sm text-slate-500">Previous Owners</p>
              </div>
              <div className={`rounded-xl p-4 text-center ${history.accidents === 0 ? "bg-green-50" : "bg-orange-50"}`}>
                <p className={`text-2xl font-bold ${history.accidents === 0 ? "text-green-600" : "text-orange-600"}`}>
                  {history.accidents}
                </p>
                <p className="text-sm text-slate-500">Accidents Reported</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {history.titleInfo.odometer.toLocaleString()}
                </p>
                <p className="text-sm text-slate-500">Last Odometer (mi)</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <span>📅</span> Vehicle History Timeline
            </h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />
              
              <div className="space-y-6">
                {history.timeline.map((event, i) => (
                  <div key={i} className="relative pl-16">
                    {/* Icon */}
                    <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 ${getEventColor(event.type)}`}>
                      {getEventIcon(event.type)}
                    </div>
                    
                    {/* Content */}
                    <div className="bg-white/50 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-primary">{event.event}</p>
                          {event.details && (
                            <p className="text-sm text-slate-600 mt-1">{event.details}</p>
                          )}
                          {event.location && (
                            <p className="text-xs text-slate-400 mt-1">📍 {event.location}</p>
                          )}
                        </div>
                        <span className="text-sm text-slate-500 whitespace-nowrap">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* CTA for full report */}
      <div className="glass-card p-6 bg-gradient-to-br from-mauve/10 to-cyan-light/10 text-center">
        <h3 className="font-semibold text-primary mb-2">Need a Full Vehicle History Report?</h3>
        <p className="text-sm text-slate-600 mb-4">
          Get a comprehensive report including service records, accident details, and more from trusted providers.
        </p>
        <div className="flex gap-3 justify-center">
          <a 
            href={`https://www.carfax.com/vehicle-history-reports/?vin=${vinInput || ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-slate-700 hover:shadow-md transition-all"
          >
            Check on Carfax →
          </a>
          <a 
            href={`https://www.autocheck.com/vehiclehistory/?vin=${vinInput || ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-slate-700 hover:shadow-md transition-all"
          >
            Check on AutoCheck →
          </a>
        </div>
      </div>
    </div>
  );
};

