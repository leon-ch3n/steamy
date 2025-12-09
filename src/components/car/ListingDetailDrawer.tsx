import { useEffect, useMemo, useState } from "react";
import { VehicleHistoryTab } from "./VehicleHistoryTab";
import { ResearchTab } from "./ResearchTab";
import { FinancingCalculator } from "./FinancingCalculator";
import { useAuth } from "../../contexts/AuthContext";
import { saveCar } from "../../lib/supabase";
import { apiFetch } from "../../lib/api";

interface Listing {
  id: string;
  heading: string;
  price: number;
  miles: number;
  exteriorColor: string;
  sellerCity: string;
  sellerState: string;
  sellerZip?: string;
  dealerLat?: number;
  dealerLng?: number;
  distanceMiles?: number;
  vdpUrl: string;
  photoUrls: string[];
  trim: string;
  isNew: boolean;
  isCertified: boolean;
  vin?: string;
}

type DetailTab = "overview" | "history" | "research" | "financing";

interface Props {
  listing: Listing | null;
  make: string;
  model: string;
  year: number;
  onClose: () => void;
}

interface DealScore {
  score: number;
  verdict: string;
  reasons: string[];
}

export const ListingDetailDrawer = ({ listing, make, model, year, onClose }: Props) => {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [dealScore, setDealScore] = useState<DealScore | null>(null);
  const [scoring, setScoring] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (listing) {
      setActiveTab("overview");
      scoreListing(listing);
    }
  }, [listing]);

  const coverPhoto = useMemo(
    () => listing?.photoUrls?.[0] || `https://via.placeholder.com/800x500/6366f1/ffffff?text=${make}+${model}`,
    [listing, make, model]
  );

  const scoreListing = async (data: Listing) => {
    setScoring(true);
    try {
      const resp = await apiFetch("/api/car/listing/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing: data }),
      });
      if (resp.ok) {
        const json = await resp.json();
        setDealScore({
          score: typeof json.score === "number" ? json.score : 50,
          verdict: json.verdict || "Score unavailable",
          reasons: Array.isArray(json.reasons) ? json.reasons : [],
        });
      } else {
        setDealScore({ score: 50, verdict: "Unable to score now", reasons: [] });
      }
    } catch (err) {
      console.error("Score error", err);
      setDealScore({ score: 50, verdict: "Unable to score now", reasons: [] });
    } finally {
      setScoring(false);
    }
  };

  if (!listing) return null;

  const handleSave = async () => {
    if (!user) {
      setSaveStatus("Please sign in to save listings");
      setTimeout(() => setSaveStatus(null), 2500);
      return;
    }
    await handleSaveInternal(user.id, listing, setSaving, setSaveStatus);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white min-h-screen w-full flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-start gap-4 p-4 border-b border-slate-200">
          <div className="flex-1">
            <p className="text-xs uppercase text-slate-400 tracking-wide">Listing</p>
            <h2 className="text-xl font-bold text-primary line-clamp-2">{listing.heading}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-slate-600">
              <span className="px-3 py-1 bg-mauve/10 text-mauve rounded-full">{listing.isNew ? "New" : "Used"}</span>
              {listing.isCertified && <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">CPO</span>}
              {listing.trim && <span className="px-3 py-1 bg-white/70 text-slate-600 rounded-full">{listing.trim}</span>}
              <span className="px-3 py-1 bg-white/70 text-slate-600 rounded-full">{listing.miles.toLocaleString()} mi</span>
              {listing.exteriorColor && <span className="px-3 py-1 bg-white/70 text-slate-600 rounded-full">Color: {listing.exteriorColor}</span>}
              <span className="px-3 py-1 bg-white/70 text-slate-600 rounded-full">
                📍 {listing.sellerCity}, {listing.sellerState}
                {typeof listing.distanceMiles === "number" ? ` • ${listing.distanceMiles.toFixed(1)} mi` : ""}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="text-2xl font-bold gradient-text">${listing.price.toLocaleString()}</p>
            <button
              onClick={handleSave}
              className="px-3 py-2 bg-white/80 text-sm font-semibold text-primary rounded-lg border border-slate-200 hover:shadow-sm disabled:opacity-50"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save to Dashboard"}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-primary transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Image + score */}
        <div className="relative">
          <img src={coverPhoto} alt={listing.heading} className="w-full h-64 md:h-96 object-cover" />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <button
              onClick={() => window.open(listing.vdpUrl, "_blank")}
              className="px-3 py-2 bg-white/80 backdrop-blur text-sm font-semibold text-primary rounded-xl shadow-sm hover:bg-white"
            >
              View on site →
            </button>
            <button
              onClick={() => alert("Test drive scheduling coming soon!")}
              className="px-3 py-2 bg-gradient-to-r from-mauve to-cyan-light text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md"
            >
              Schedule Test Drive
            </button>
          </div>
          <div className="absolute top-3 right-3">
            <DealScoreBadge
              score={dealScore?.score}
              verdict={dealScore?.verdict}
              reasons={dealScore?.reasons}
              loading={scoring}
              onRefresh={() => listing && scoreListing(listing)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 pt-4 border-b border-slate-200">
          <div className="flex gap-2 overflow-x-auto pb-3">
            {(["overview", "history", "research", "financing"] as DetailTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap " +
                  (activeTab === tab
                    ? "bg-gradient-to-r from-mauve to-cyan-light text-primary shadow-sm"
                    : "bg-white/70 text-slate-600 hover:bg-white")
                }
              >
                {tabLabel(tab)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-4 bg-slate-50">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="glass-card p-4">
                <h3 className="text-lg font-semibold text-primary mb-2">At a glance</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-700">
                  <SpecRow label="Condition" value={`${listing.isNew ? "New" : "Used"}${listing.isCertified ? " • CPO" : ""}`} />
                  <SpecRow label="Mileage" value={`${listing.miles.toLocaleString()} mi`} />
                  <SpecRow label="Trim" value={listing.trim || "—"} />
                  <SpecRow label="Exterior" value={listing.exteriorColor || "—"} />
                  <SpecRow label="Location" value={`${listing.sellerCity}, ${listing.sellerState}`} />
                  <SpecRow label="VIN" value={listing.vin || "Not provided"} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <VehicleHistoryTab
              make={make}
              model={model}
              year={year}
              vin={listing.vin}
              safety={{
                recalls: [],
                complaints: [],
                recallCount: 0,
                complaintCount: 0,
              }}
            />
          )}

          {activeTab === "research" && (
            <ResearchTab
              make={make}
              model={model}
              year={year}
              insights={null}
            />
          )}

          {activeTab === "financing" && (
            <FinancingCalculator
              averagePrice={listing.price || 35000}
              make={make}
              model={model}
              year={year}
            />
          )}
        </div>
      </div>
      {saveStatus && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/90 text-primary text-sm px-4 py-2 rounded-full shadow">
          {saveStatus}
        </div>
      )}
    </div>
  );
};

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-primary text-right">{value}</span>
    </div>
  );
}

function tabLabel(tab: DetailTab) {
  switch (tab) {
    case "overview":
      return "Overview";
    case "history":
      return "Vehicle History";
    case "research":
      return "Research";
    case "financing":
      return "Financing";
    default:
      return tab;
  }
}

function DealScoreBadge({
  score,
  verdict,
  reasons,
  loading,
  onRefresh,
}: {
  score?: number;
  verdict?: string;
  reasons?: string[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const color = scoreColor(score);

  return (
    <div className="bg-white/85 backdrop-blur rounded-xl p-3 shadow-sm min-w-[180px]">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-xs font-semibold text-slate-500">Deal Score</span>
        <button
          onClick={onRefresh}
          className="text-xs text-mauve hover:underline disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Scoring..." : "Refresh"}
        </button>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-bold ${color}`}>{score ?? "—"}</span>
        <span className="text-sm text-slate-500">{verdict || "Pending"}</span>
      </div>
      {reasons && reasons.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs text-slate-600">
          {reasons.slice(0, 3).map((r, i) => (
            <li key={i}>• {r}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function scoreColor(score?: number) {
  if (score === undefined) return "text-slate-500";
  if (score >= 85) return "text-green-600";
  if (score >= 70) return "text-emerald-600";
  if (score >= 55) return "text-amber-600";
  return "text-red-600";
}
async function handleSaveInternal(
  userId: string,
  listing: Listing,
  setSaving: (v: boolean) => void,
  setSaveStatus: (v: string | null) => void
) {
  setSaving(true);
  setSaveStatus(null);
  try {
    await saveCar(userId, listing.heading, listing);
    setSaveStatus("Saved to your dashboard");
  } catch (err) {
    console.error("Save error", err);
    setSaveStatus("Unable to save right now");
  } finally {
    setSaving(false);
    setTimeout(() => setSaveStatus(null), 3000);
  }
}

