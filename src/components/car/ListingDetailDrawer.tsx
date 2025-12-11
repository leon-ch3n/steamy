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

/**
 * ListingDetailDrawer - Now renders as an inline expandable panel instead of overlay.
 * Expands in-place below the listing cards, pushing content down.
 */
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
    () => listing?.photoUrls?.[0] || `https://via.placeholder.com/800x500/121218/38BDF8?text=${make}+${model}`,
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
    <div className="glass-card animate-expand-down overflow-hidden mt-6">
      {/* Header */}
      <div className="flex items-start gap-4 p-6 border-b border-slate-200/50">
        <div className="flex-1">
          <p className="text-xs uppercase text-slate-500 tracking-wide mb-1">Listing Details</p>
          <h2 className="text-xl font-bold text-primary line-clamp-2">{listing.heading}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-xs rounded-lg">{listing.isNew ? "New" : "Used"}</span>
            {listing.isCertified && <span className="px-2 py-1 bg-blue-100 border border-blue-200 text-blue-700 text-xs rounded-lg">CPO</span>}
            {listing.trim && <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-xs rounded-lg">{listing.trim}</span>}
            <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-xs rounded-lg">{listing.miles.toLocaleString()} mi</span>
            {listing.exteriorColor && <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-xs rounded-lg">{listing.exteriorColor}</span>}
            <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-xs rounded-lg">
              {listing.sellerCity}, {listing.sellerState}
              {typeof listing.distanceMiles === "number" ? ` • ${listing.distanceMiles.toFixed(1)} mi away` : ""}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <p className="text-2xl font-bold gradient-text">${listing.price.toLocaleString()}</p>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-white/50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-white transition-all disabled:opacity-50"
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

      {/* Image + score - Split layout */}
      <div className="grid lg:grid-cols-2 gap-0">
        <div className="relative">
          <img src={coverPhoto} alt={listing.heading} className="w-full h-64 lg:h-80 object-cover" />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <button
              onClick={() => window.open(listing.vdpUrl, "_blank")}
              className="px-4 py-2 bg-white/90 backdrop-blur-sm border border-white/50 text-sm font-semibold text-primary hover:bg-white transition-all rounded-xl"
            >
              View on site →
            </button>
            <button
              onClick={() => alert("Test drive scheduling coming soon!")}
              className="px-4 py-2 bg-gradient-to-r from-mauve to-cyan-light text-primary text-sm font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Schedule Test Drive
            </button>
          </div>
        </div>
        <div className="bg-white/30 backdrop-blur-sm p-6 flex flex-col justify-center">
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
      <div className="px-6 pt-4 border-b border-slate-200/50">
        <div className="flex gap-1 overflow-x-auto pb-0">
          {(["overview", "history", "research", "financing"] as DetailTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeTab === tab ? "bg-white/50 text-primary border-b-2 border-mauve" : "text-slate-500 hover:text-primary"}`}
            >
              {tabLabel(tab)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-white/20">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">At a glance</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
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

      {/* Save status notification */}
      {saveStatus && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-slate-200 text-primary text-sm px-6 py-3 rounded-xl shadow-lg z-50">
          {saveStatus}
        </div>
      )}
    </div>
  );
};

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 py-2 border-b border-slate-200/50 last:border-0">
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
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-sm font-semibold text-slate-600">Deal Score</span>
        <button
          onClick={onRefresh}
          className="text-xs text-mauve hover:underline disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Scoring..." : "Refresh"}
        </button>
      </div>
      <div className="flex items-baseline gap-3 mb-3">
        <span className={`text-4xl font-bold ${color}`}>{score ?? "—"}</span>
        <span className="text-sm text-slate-600">{verdict || "Pending"}</span>
      </div>
      {reasons && reasons.length > 0 && (
        <ul className="space-y-2 text-sm text-slate-600">
          {reasons.slice(0, 3).map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-mauve">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function scoreColor(score?: number) {
  if (score === undefined) return "text-slate-400";
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
