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
    <div className="surface-elevated animate-expand-down overflow-hidden mt-6">
      {/* Header */}
      <div className="flex items-start gap-4 p-6 border-b border-dark-700">
        <div className="flex-1">
          <p className="text-xs uppercase text-light-300 tracking-wide mb-1">Listing Details</p>
          <h2 className="text-xl font-bold text-light-50 line-clamp-2">{listing.heading}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="badge">{listing.isNew ? "New" : "Used"}</span>
            {listing.isCertified && <span className="badge-ember">CPO</span>}
            {listing.trim && <span className="badge">{listing.trim}</span>}
            <span className="badge">{listing.miles.toLocaleString()} mi</span>
            {listing.exteriorColor && <span className="badge">{listing.exteriorColor}</span>}
            <span className="badge">
              {listing.sellerCity}, {listing.sellerState}
              {typeof listing.distanceMiles === "number" ? ` • ${listing.distanceMiles.toFixed(1)} mi away` : ""}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <p className="text-2xl font-bold text-ember">${listing.price.toLocaleString()}</p>
          <button
            onClick={handleSave}
            className="btn-secondary px-4 py-2 text-sm disabled:opacity-50"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save to Dashboard"}
          </button>
          <button
            onClick={onClose}
            className="text-light-300 hover:text-light-50 transition-colors"
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
              className="px-4 py-2 bg-dark-900/90 border border-dark-600 text-sm font-semibold text-light-50 hover:border-ember/50 transition-all"
            >
              View on site →
            </button>
            <button
              onClick={() => alert("Test drive scheduling coming soon!")}
              className="btn-primary px-4 py-2 text-sm"
            >
              Schedule Test Drive
            </button>
          </div>
        </div>
        <div className="bg-dark-800 p-6 flex flex-col justify-center">
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
      <div className="px-6 pt-4 border-b border-dark-700">
        <div className="flex gap-1 overflow-x-auto pb-0">
          {(["overview", "history", "research", "financing"] as DetailTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
            >
              {tabLabel(tab)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-dark-900">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="surface p-6">
              <h3 className="text-lg font-semibold text-light-50 mb-4">At a glance</h3>
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-dark-800 border border-dark-600 text-light-50 text-sm px-6 py-3 shadow-lg z-50">
          {saveStatus}
        </div>
      )}
    </div>
  );
};

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 py-2 border-b border-dark-700 last:border-0">
      <span className="text-light-300">{label}</span>
      <span className="font-medium text-light-50 text-right">{value}</span>
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
        <span className="text-sm font-semibold text-light-200">Deal Score</span>
        <button
          onClick={onRefresh}
          className="text-xs text-ember hover:text-ember-hover disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Scoring..." : "Refresh"}
        </button>
      </div>
      <div className="flex items-baseline gap-3 mb-3">
        <span className={`text-4xl font-bold ${color}`}>{score ?? "—"}</span>
        <span className="text-sm text-light-200">{verdict || "Pending"}</span>
      </div>
      {reasons && reasons.length > 0 && (
        <ul className="space-y-2 text-sm text-light-200">
          {reasons.slice(0, 3).map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-ember">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function scoreColor(score?: number) {
  if (score === undefined) return "text-light-300";
  if (score >= 85) return "text-green-400";
  if (score >= 70) return "text-emerald-400";
  if (score >= 55) return "text-amber-400";
  return "text-red-400";
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
