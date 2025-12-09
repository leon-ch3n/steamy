import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { ListingsWidget } from "../components/car/ListingsWidget";
import { ListingDetailDrawer } from "../components/car/ListingDetailDrawer";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getPreferences } from "../lib/supabase";

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
    vdpUrl: string;
    photoUrls: string[];
    trim: string;
    isNew: boolean;
    isCertified: boolean;
    vin?: string;
  }>;
  totalListings: number;
}

type TabId = "overview" | "history" | "research" | "financing" | "listings";

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
  const [city, setCity] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string | undefined>(undefined);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  // Load user preferences for location (zip/radius) once, then fetch profile
  useEffect(() => {
    const loadPrefs = async () => {
      try {
        // priority: user prefs -> query params -> defaults
        if (user) {
          const prefs = await getPreferences(user.id);
          if (prefs) {
            if (prefs.zip_code) setZip(prefs.zip_code);
            if (prefs.search_radius) setRadius(prefs.search_radius);
            if (prefs.city) setCity(prefs.city);
            if (prefs.state) setState(prefs.state);
          } else {
            // fallback to query params if present
            const qpZip = searchParams.get("zip");
            const qpRadius = searchParams.get("radius");
            const qpCity = searchParams.get("city");
            const qpState = searchParams.get("state");
            if (qpZip) setZip(qpZip);
            if (qpRadius) setRadius(parseInt(qpRadius) || 50);
            if (qpCity) setCity(qpCity);
            if (qpState) setState(qpState);
          }
        } else {
          const qpZip = searchParams.get("zip");
          const qpRadius = searchParams.get("radius");
          const qpCity = searchParams.get("city");
          const qpState = searchParams.get("state");
          if (qpZip) setZip(qpZip);
          if (qpRadius) setRadius(parseInt(qpRadius) || 50);
          if (qpCity) setCity(qpCity);
          if (qpState) setState(qpState);
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
        const response = await fetch(`/api/car/profile/${encodeURIComponent(make)}/${encodeURIComponent(model)}/${year}?${new URLSearchParams({
          ...(zip ? { zip } : {}),
          radius: radius.toString(),
          ...(city ? { city } : {}),
          ...(state ? { state } : {}),
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
  // no location UI on results; just honor any query params initially

  if (!make || !model || !year) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Invalid Vehicle</h1>
          <Link to="/" className="gradient-text font-semibold">Go Home</Link>
        </main>
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
            <p className="text-slate-600">Loading vehicle profile...</p>
            <p className="text-sm text-slate-400 mt-2">Fetching specs, safety data, listings, and insights</p>
          </div>
        ) : error ? (
          <div className="glass-card p-12 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-gradient-to-r from-mauve to-cyan-light text-primary font-semibold rounded-xl"
            >
              Try Again
            </button>
          </div>
        ) : data ? (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Section */}
            <div className="glass-card p-8 md:p-10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {data.year} <span className="gradient-text">{data.make} {data.model}</span>
                  </h1>
                  
                  {data.insights && (
                    <p className="text-slate-600 text-lg mb-4 max-w-2xl">
                      {data.insights.summary}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    {data.insights && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        data.insights.ownerSentiment === "very_positive" ? "bg-green-100 text-green-700" :
                        data.insights.ownerSentiment === "positive" ? "bg-blue-100 text-blue-700" :
                        data.insights.ownerSentiment === "mixed" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {data.insights.ownerSentiment === "very_positive" ? "⭐ Highly Recommended" :
                         data.insights.ownerSentiment === "positive" ? "👍 Recommended" :
                         data.insights.ownerSentiment === "mixed" ? "⚖️ Mixed Reviews" : "⚠️ Use Caution"}
                      </span>
                    )}
                    {data.safety?.safety?.overallRating && data.safety.safety.overallRating !== "Not Rated" && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                        🛡️ {data.safety.safety.overallRating}/5 Safety
                      </span>
                    )}
                    {data.safety?.recallCount > 0 && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                        🔔 {data.safety.recallCount} Recalls
                      </span>
                    )}
                  </div>

                  {/* Schedule Test Drive Button */}
                  <button 
                    className="px-6 py-3 bg-gradient-to-r from-mauve to-cyan-light text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                    onClick={() => alert("Test drive scheduling coming soon!")}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Schedule Test Drive
                  </button>
                </div>

                {/* Price Stats */}
                {data.marketStats && (
                  <div className="bg-white/70 rounded-2xl p-6 min-w-[220px] shadow-sm">
                    <p className="text-sm text-slate-500 mb-1">Market Price</p>
                    <p className="text-3xl font-bold gradient-text mb-2">
                      {formatPrice(data.marketStats.averagePrice)}
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatPrice(data.marketStats.minPrice)} - {formatPrice(data.marketStats.maxPrice)}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      Based on {data.totalListings.toLocaleString()} listings
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-500">Avg. Mileage</span>
                          <span className="font-medium">{data.marketStats.averageMiles?.toLocaleString() || "N/A"} mi</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Days on Market</span>
                          <span className="font-medium">{data.marketStats.averageDaysOnMarket || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Listings only (PitchBook lives on individual listings) */}
            <div className="animate-fade-in">
              <ListingsWidget 
                listings={data.sampleListings} 
                totalListings={data.totalListings}
                make={make}
                model={model}
                year={parseInt(year)}
                onSelectListing={handleSelectListing}
              />
            </div>

            {selectedListing && (
              <ListingDetailDrawer
                listing={selectedListing as any}
                make={make}
                model={model}
                year={parseInt(year)}
                onClose={() => setSelectedListing(null)}
              />
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
};
