import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { VehicleHistoryTab } from "../components/car/VehicleHistoryTab";
import { ResearchTab } from "../components/car/ResearchTab";
import { FinancingCalculator } from "../components/car/FinancingCalculator";
import { useAuth } from "../contexts/AuthContext";
import { saveCar } from "../lib/supabase";
import { apiFetch } from "../lib/api";

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

interface DealScore {
  score: number;
  verdict: string;
  reasons: string[];
}

export const ListingDetail = () => {
  const { make, model, year, listingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Get listing from navigation state
  const listing: Listing | null = location.state?.listing || null;

  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [dealScore, setDealScore] = useState<DealScore | null>(null);
  const [scoring, setScoring] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    if (listing) {
      scoreListing(listing);
    }
    window.scrollTo(0, 0);
  }, [listing]);

  const coverPhoto = useMemo(
    () => listing?.photoUrls?.[activePhotoIndex] || listing?.photoUrls?.[0] || `https://via.placeholder.com/800x500/6366f1/ffffff?text=${make}+${model}`,
    [listing, make, model, activePhotoIndex]
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

  const handleSave = async () => {
    if (!user) {
      setSaveStatus("Please sign in to save listings");
      setTimeout(() => setSaveStatus(null), 2500);
      return;
    }
    if (!listing) return;
    
    setSaving(true);
    setSaveStatus(null);
    try {
      await saveCar(user.id, listing.heading, listing);
      setSaveStatus("Saved to your dashboard");
    } catch (err) {
      console.error("Save error", err);
      setSaveStatus("Unable to save right now");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleBack = () => {
    navigate(`/car/${make}/${model}/${year}`);
  };

  if (!listing) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="glass-card p-12 text-center">
            <p className="text-slate-600 mb-4">Listing not found</p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gradient-to-r from-mauve to-cyan-light text-primary font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Back to {year} {make} {model}
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 pb-24">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm flex items-center gap-2">
          <Link to="/" className="text-slate-500 hover:text-primary transition-colors">Home</Link>
          <span className="text-slate-400">/</span>
          <Link to={`/car/${make}/${model}/${year}`} className="text-slate-500 hover:text-primary transition-colors">
            {year} {make} {model}
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-primary font-medium">Listing Details</span>
        </nav>

        {/* Back button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to all listings
        </button>

        {/* Hero Section */}
        <div className="glass-card overflow-hidden mb-8 animate-fade-in">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-slate-200/50">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary mb-3">{listing.heading}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-mauve/20 to-cyan-light/20 border border-mauve/30 text-primary text-sm font-medium rounded-xl">
                    {listing.isNew ? "New" : "Used"}
                  </span>
                  {listing.isCertified && (
                    <span className="px-3 py-1.5 bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium rounded-xl">
                      Certified Pre-Owned
                    </span>
                  )}
                  {listing.trim && (
                    <span className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 text-sm rounded-xl">
                      {listing.trim}
                    </span>
                  )}
                  <span className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 text-sm rounded-xl">
                    {listing.miles.toLocaleString()} mi
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <p className="text-3xl md:text-4xl font-bold gradient-text">${listing.price.toLocaleString()}</p>
                <p className="text-sm text-slate-500">
                  {listing.sellerCity}, {listing.sellerState}
                  {typeof listing.distanceMiles === "number" && ` • ${listing.distanceMiles.toFixed(1)} mi away`}
                </p>
              </div>
            </div>
          </div>

          {/* Image Gallery + Deal Score */}
          <div className="grid lg:grid-cols-2">
            {/* Photo Section */}
            <div className="relative">
              <img 
                src={coverPhoto} 
                alt={listing.heading} 
                className="w-full h-72 md:h-96 object-cover"
              />
              {/* Photo navigation */}
              {listing.photoUrls && listing.photoUrls.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {listing.photoUrls.slice(0, 5).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === activePhotoIndex 
                          ? "bg-white scale-125" 
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              )}
              {/* Action buttons */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <a
                  href={listing.vdpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-white/95 backdrop-blur-sm border border-white/50 text-sm font-semibold text-primary hover:bg-white transition-all rounded-xl shadow-lg"
                >
                  View on dealer site →
                </a>
                <button
                  onClick={() => alert("Test drive scheduling coming soon!")}
                  className="px-4 py-2.5 bg-gradient-to-r from-mauve to-cyan-light text-primary text-sm font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  Schedule Test Drive
                </button>
              </div>
            </div>

            {/* Deal Score */}
            <div className="bg-white/40 backdrop-blur-sm p-6 md:p-8 flex flex-col justify-center">
              <DealScoreBadge
                score={dealScore?.score}
                verdict={dealScore?.verdict}
                reasons={dealScore?.reasons}
                loading={scoring}
                onRefresh={() => listing && scoreListing(listing)}
              />
              
              {/* Save button */}
              <div className="mt-6 pt-6 border-t border-slate-200/50">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full px-6 py-3 bg-white/60 border border-slate-200 text-primary font-medium rounded-xl hover:bg-white transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save to Dashboard"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass-card mb-8">
          <div className="px-6 pt-4 border-b border-slate-200/50">
            <div className="flex gap-1 overflow-x-auto pb-0">
              {(["overview", "history", "research", "financing"] as DetailTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium rounded-t-xl transition-all whitespace-nowrap ${
                    activeTab === tab 
                      ? "bg-white/60 text-primary border-b-2 border-mauve" 
                      : "text-slate-500 hover:text-primary hover:bg-white/30"
                  }`}
                >
                  {tabLabel(tab)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {activeTab === "overview" && (
              <div className="space-y-6 animate-fade-in">
                {/* At a glance */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-primary mb-4">At a Glance</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <SpecRow label="Condition" value={`${listing.isNew ? "New" : "Used"}${listing.isCertified ? " • CPO" : ""}`} />
                    <SpecRow label="Mileage" value={`${listing.miles.toLocaleString()} mi`} />
                    <SpecRow label="Trim" value={listing.trim || "—"} />
                    <SpecRow label="Exterior Color" value={listing.exteriorColor || "—"} />
                    <SpecRow label="Location" value={`${listing.sellerCity}, ${listing.sellerState}`} />
                    <SpecRow label="VIN" value={listing.vin || "Not provided"} />
                  </div>
                </div>

                {/* Quick actions */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <a
                    href={listing.vdpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card p-6 flex items-center gap-4 hover:shadow-lg transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mauve/20 to-cyan-light/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-primary group-hover:text-mauve transition-colors">View Full Listing</p>
                      <p className="text-sm text-slate-500">See all details on dealer site</p>
                    </div>
                  </a>
                  <button
                    onClick={() => alert("Test drive scheduling coming soon!")}
                    className="glass-card p-6 flex items-center gap-4 hover:shadow-lg transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mauve to-cyan-light flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-primary group-hover:text-mauve transition-colors">Schedule Test Drive</p>
                      <p className="text-sm text-slate-500">Book a time to see this car</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="animate-fade-in">
                <VehicleHistoryTab
                  make={make || ""}
                  model={model || ""}
                  year={parseInt(year || "2024")}
                  vin={listing.vin}
                  safety={{
                    recalls: [],
                    complaints: [],
                    recallCount: 0,
                    complaintCount: 0,
                  }}
                />
              </div>
            )}

            {activeTab === "research" && (
              <div className="animate-fade-in">
                <ResearchTab
                  make={make || ""}
                  model={model || ""}
                  year={parseInt(year || "2024")}
                  insights={null}
                />
              </div>
            )}

            {activeTab === "financing" && (
              <div className="animate-fade-in">
                <FinancingCalculator
                  averagePrice={listing.price || 35000}
                  make={make || ""}
                  model={model || ""}
                  year={parseInt(year || "2024")}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Save status notification */}
      {saveStatus && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm border border-slate-200 text-primary text-sm px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
          {saveStatus}
        </div>
      )}

      <Footer />
    </div>
  );
};

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 py-3 border-b border-slate-200/30 last:border-0">
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
  const getScoreColor = (s?: number) => {
    if (s === undefined) return "text-slate-400";
    if (s >= 85) return "text-green-600";
    if (s >= 70) return "text-emerald-600";
    if (s >= 55) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBg = (s?: number) => {
    if (s === undefined) return "from-slate-100 to-slate-200";
    if (s >= 85) return "from-green-100 to-green-200";
    if (s >= 70) return "from-emerald-100 to-emerald-200";
    if (s >= 55) return "from-amber-100 to-amber-200";
    return "from-red-100 to-red-200";
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-lg font-semibold text-primary">Deal Score</h3>
        <button
          onClick={onRefresh}
          className="text-sm text-mauve hover:underline disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Refresh"}
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mauve/20 to-cyan-light/20 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-mauve border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-500">Analyzing this deal...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getScoreBg(score)} flex items-center justify-center`}>
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score ?? "—"}</span>
            </div>
            <div>
              <p className={`text-lg font-semibold ${getScoreColor(score)}`}>{verdict || "Pending"}</p>
              <p className="text-sm text-slate-500">Based on market analysis</p>
            </div>
          </div>
          
          {reasons && reasons.length > 0 && (
            <ul className="space-y-2">
              {reasons.slice(0, 3).map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-mauve mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default ListingDetail;
