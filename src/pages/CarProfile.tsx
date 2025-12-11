import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ListingsWidget } from "../components/car/ListingsWidget";
import { ListingDetailDrawer } from "../components/car/ListingDetailDrawer";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getPreferences } from "../lib/supabase";
import { apiFetch } from "../lib/api";
import { FadeIn } from "../components/ui/FadeIn";

interface CarProfileData {
  make: string;
  model: string;
  year: number;
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
  marketStats: {
    averagePrice: number;
    medianPrice: number;
    minPrice: number;
    maxPrice: number;
    totalListings: number;
    averageMiles: number;
    averageDaysOnMarket: number;
  } | null;
  sampleListings: Array<{
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
  }>;
  totalListings: number;
  searchNote?: string;
}

export const CarProfile = () => {
  const { make, model, year } = useParams<{ make: string; model: string; year: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [data, setData] = useState<CarProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [zip, setZip] = useState<string | undefined>(searchParams.get("zip") || undefined);
  const [radius, setRadius] = useState<number>(parseInt(searchParams.get("radius") || "50"));
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  useEffect(() => {
    const loadPrefs = async () => {
      try {
        if (user) {
          const prefs = await getPreferences(user.id);
          if (prefs) {
            if (prefs.zip_code) setZip(prefs.zip_code);
            if (prefs.search_radius) setRadius(prefs.search_radius);
          } else {
            const qpZip = searchParams.get("zip");
            const qpRadius = searchParams.get("radius");
            if (qpZip) setZip(qpZip);
            if (qpRadius) setRadius(parseInt(qpRadius) || 50);
          }
        } else {
          const qpZip = searchParams.get("zip");
          const qpRadius = searchParams.get("radius");
          if (qpZip) setZip(qpZip);
          if (qpRadius) setRadius(parseInt(qpRadius) || 50);
        }
      } catch (err) {
        console.error("Error loading preferences:", err);
      } finally {
        setPrefsLoaded(true);
      }
    };
    loadPrefs();
  }, [user, searchParams]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!make || !model || !year || !prefsLoaded) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiFetch(`/api/car/profile/${encodeURIComponent(make)}/${encodeURIComponent(model)}/${year}?${new URLSearchParams({
          ...(zip ? { zip } : {}),
          radius: radius.toString(),
        }).toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch car profile");
        }
        const profileData = await response.json();
        setData(profileData);
      } catch (err) {
        console.error("Error fetching car profile:", err);
        setError("Failed to load car profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [make, model, year, zip, radius, prefsLoaded]);

  if (!make || !model || !year) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Invalid Vehicle</h1>
          <Link to="/" className="text-mauve font-semibold hover:underline">Go Home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSelectListing = (listing: any) => {
    setSelectedListing(listing);
    // Scroll to the detail section after a short delay to allow render
    setTimeout(() => {
      const detailSection = document.getElementById('listing-detail');
      if (detailSection) {
        detailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 pb-24">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link to="/" className="text-slate-500 hover:text-primary">Home</Link>
          <span className="mx-2 text-slate-400">/</span>
          <Link to="/results" className="text-slate-500 hover:text-primary">Search</Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-primary font-medium">{year} {make} {model}</span>
        </nav>

        {loading ? (
          <div className="glass-card p-12 text-center animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-mauve animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-3 h-3 rounded-full bg-mauve animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-3 h-3 rounded-full bg-mauve animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <p className="text-primary">Loading vehicle profile...</p>
            <p className="text-sm text-slate-500 mt-2">Fetching specs, safety data, listings, and insights</p>
          </div>
        ) : error ? (
          <div className="glass-card p-12 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-gradient-to-r from-mauve to-cyan-light text-primary font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        ) : data ? (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Section - Split Layout */}
            <div className="grid lg:grid-cols-2 gap-4">
              <FadeIn>
                <div className="glass-card p-8 md:p-10 h-full">
                  <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {data.year} <span className="gradient-text">{data.make} {data.model}</span>
                  </h1>
                  
                  {data.insights && (
                    <p className="text-slate-600 text-lg mb-6 max-w-2xl">
                      {data.insights.summary}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    {data.insights && (
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        data.insights.ownerSentiment === "very_positive" ? "bg-green-100 border border-green-200 text-green-700" :
                        data.insights.ownerSentiment === "positive" ? "bg-blue-100 border border-blue-200 text-blue-700" :
                        data.insights.ownerSentiment === "mixed" ? "bg-yellow-100 border border-yellow-200 text-yellow-700" :
                        "bg-red-100 border border-red-200 text-red-700"
                      }`}>
                        {data.insights.ownerSentiment === "very_positive" ? "Highly Recommended" :
                         data.insights.ownerSentiment === "positive" ? "Recommended" :
                         data.insights.ownerSentiment === "mixed" ? "Mixed Reviews" : "Use Caution"}
                      </span>
                    )}
                    {data.safety?.safety?.overallRating && data.safety.safety.overallRating !== "Not Rated" && (
                      <span className="px-3 py-1 rounded-lg text-sm font-medium bg-purple-100 border border-purple-200 text-purple-700">
                        {data.safety.safety.overallRating}/5 Safety
                      </span>
                    )}
                    {data.safety?.recallCount > 0 && (
                      <span className="px-3 py-1 rounded-lg text-sm font-medium bg-orange-100 border border-orange-200 text-orange-700">
                        {data.safety.recallCount} Recalls
                      </span>
                    )}
                  </div>
                </div>
              </FadeIn>

              {/* Price Stats - only show if we have market data */}
              {data.marketStats && (
                <FadeIn delay={0.1}>
                  <div className="glass-card p-8 md:p-10 h-full flex flex-col justify-center">
                    <p className="text-sm text-slate-500 mb-1">Market Price</p>
                    <p className="text-4xl font-bold gradient-text mb-2">
                      {formatPrice(data.marketStats.averagePrice)}
                    </p>
                    <p className="text-sm text-slate-500 mb-6">
                      {formatPrice(data.marketStats.minPrice)} - {formatPrice(data.marketStats.maxPrice)}
                    </p>
                    <p className="text-xs text-slate-500 mb-6">
                      Based on {data.totalListings.toLocaleString()} listings
                    </p>
                    <div className="pt-6 border-t border-slate-200/50">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Avg. Mileage</span>
                          <p className="font-medium text-primary">{data.marketStats.averageMiles?.toLocaleString() || "N/A"} mi</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Days on Market</span>
                          <p className="font-medium text-primary">{data.marketStats.averageDaysOnMarket || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              )}
            </div>

            {/* Listings */}
            <FadeIn delay={0.2}>
              {/* Search note banner if location was widened/fallback */}
              {data.searchNote && (
                <div className="glass-card p-4 mb-4 flex items-center gap-3 border-l-4 border-amber-400">
                  <span className="text-amber-500">📍</span>
                  <p className="text-sm text-slate-600">{data.searchNote}</p>
                </div>
              )}
              <ListingsWidget 
                listings={data.sampleListings} 
                totalListings={data.totalListings}
                make={make}
                model={model}
                year={parseInt(year)}
                onSelectListing={handleSelectListing}
              />
            </FadeIn>

            {/* Inline Listing Detail (not overlay) */}
            {selectedListing && (
              <div id="listing-detail">
                <ListingDetailDrawer
                  listing={selectedListing}
                  make={make}
                  model={model}
                  year={parseInt(year)}
                  onClose={() => setSelectedListing(null)}
                />
              </div>
            )}
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
};
