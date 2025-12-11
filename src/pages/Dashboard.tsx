import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { 
  getSearchHistory, 
  getSavedCars, 
  getPreferences, 
  savePreferences,
  removeSavedCar,
  updateCarNote,
  SearchHistory,
  SavedCar,
  UserPreferences 
} from "../lib/supabase";

// Mock alerts and insights (these would come from a real backend in production)
const mockAlerts = [
  {
    id: "1",
    type: "price_drop",
    message: "RAV4 Hybrid dropped $500 at AutoNation Toyota",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "2",
    type: "new_listing",
    message: "New 2024 CR-V listed matching your preferences",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "3",
    type: "market",
    message: "SUV prices in your area down 3% this month",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
];

const mockInsights = [
  {
    id: "1",
    title: "Best Time to Buy",
    content: "SUV inventory is high right now—dealers are more likely to negotiate.",
    icon: "trending",
  },
  {
    id: "2",
    title: "Price Trend",
    content: "RAV4 Hybrid prices have dropped 4% over the past 30 days in your area.",
    icon: "price",
  },
  {
    id: "3",
    title: "Depreciation Alert",
    content: "The Tucson Hybrid holds value well—expect 15% depreciation in year 1.",
    icon: "chart",
  },
];

type Tab = "history" | "saved" | "alerts" | "preferences" | "insights";

// Tab icon component
const TabIcon = ({ type }: { type: string }) => {
  const iconClass = "w-4 h-4";
  switch (type) {
    case "history":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "saved":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    case "alerts":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      );
    case "preferences":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "insights":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    default:
      return null;
  }
};

// Alert icon component
const AlertIcon = ({ type }: { type: string }) => {
  const iconClass = "w-5 h-5";
  switch (type) {
    case "price_drop":
      return (
        <svg className={`${iconClass} text-green-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "new_listing":
      return (
        <svg className={`${iconClass} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      );
    case "market":
      return (
        <svg className={`${iconClass} text-purple-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    default:
      return null;
  }
};

// Insight icon component
const InsightIcon = ({ type }: { type: string }) => {
  const iconClass = "w-6 h-6 text-mauve";
  switch (type) {
    case "trending":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    case "price":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "chart":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    default:
      return null;
  }
};

export const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("history");
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [savedCars, setSavedCars] = useState<SavedCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    budget_min: 25000,
    budget_max: 45000,
    body_types: ["SUV", "Crossover"],
    fuel_types: ["Hybrid", "Gas"],
    must_haves: ["Backup Camera", "Apple CarPlay", "Safety Package"],
    dealbreakers: ["Manual Transmission", "No Warranty"],
    city: "",
    state: "",
    zip_code: "",
    search_radius: 50,
  });
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Fetch user data when authenticated
  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [history, cars, prefs] = await Promise.all([
          getSearchHistory(user.id),
          getSavedCars(user.id),
          getPreferences(user.id),
        ]);
        
        setSearchHistory(history);
        setSavedCars(cars);
        if (prefs) {
          setPreferences(prefs);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchData();
    }
  }, [user, authLoading]);

  const handleSavePreferences = async () => {
    if (!user) return;
    setSavingPrefs(true);
    try {
      await savePreferences(user.id, preferences);
    } catch (err) {
      console.error("Error saving preferences:", err);
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleRemoveCar = async (carId: string) => {
    const success = await removeSavedCar(carId);
    if (success) {
      setSavedCars(savedCars.filter(c => c.id !== carId));
    }
  };

  const handleUpdateNote = async (carId: string) => {
    const success = await updateCarNote(carId, noteText);
    if (success) {
      setSavedCars(savedCars.map(c => 
        c.id === carId ? { ...c, note: noteText } : c
      ));
      setEditingNote(null);
      setNoteText("");
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  const formatTimeDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  const tabs = [
    { id: "history" as Tab, label: "Search History", icon: "history" },
    { id: "saved" as Tab, label: "Saved Cars", icon: "saved" },
    { id: "alerts" as Tab, label: "Alerts", icon: "alerts" },
    { id: "preferences" as Tab, label: "Preferences", icon: "preferences" },
    { id: "insights" as Tab, label: "Market Insights", icon: "insights" },
  ];

  // Show sign-in prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 md:px-8 py-24 text-center">
          <div className="glass-card p-12 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-mauve/20 to-cyan-light/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-mauve" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-primary mb-3">
              Sign in to access your <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-slate-600 mb-8">
              Save your searches, track vehicles, and get personalized insights.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gradient-to-r from-mauve to-cyan-light text-primary font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Go Home to Sign In
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 md:px-8 py-24 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-mauve animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-mauve animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-mauve animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <p className="text-slate-600 mt-4">Loading your dashboard...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 pb-24">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Your <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-slate-600">
            Track your car search, saved vehicles, and get personalized insights.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 animate-slide-up">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white shadow-md text-primary"
                  : "bg-white/50 text-slate-600 hover:bg-white/80"
              }`}
            >
              <TabIcon type={tab.icon} />
              {tab.label}
              {tab.id === "alerts" && (
                <span className="bg-gradient-to-r from-mauve to-thistle text-primary text-xs px-2 py-0.5 rounded-full">
                  {mockAlerts.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {/* Search History Tab */}
          {activeTab === "history" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary">Recent Searches</h2>
                <span className="text-sm text-slate-500">{searchHistory.length} searches</span>
              </div>
              
              {searchHistory.length > 0 ? (
                searchHistory.map((search, index) => (
                  <Link
                    key={search.id}
                    to={`/results?q=${encodeURIComponent(search.query)}`}
                    className="glass-card p-5 block hover:shadow-lg transition-all duration-200 animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-primary font-medium mb-1">{search.query}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>{formatTime(search.created_at)}</span>
                          <span>•</span>
                          <span>{search.results_count} results</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>Resume</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="glass-card p-12 text-center">
                  <p className="text-slate-500 mb-4">No searches yet</p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-mauve to-cyan-light text-primary font-semibold rounded-xl"
                  >
                    Start Searching
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Saved Cars Tab */}
          {activeTab === "saved" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary">Saved Vehicles</h2>
                {savedCars.length > 1 && (
                  <button className="text-sm text-slate-500 hover:text-primary transition-colors">
                    Compare All
                  </button>
                )}
              </div>

              {savedCars.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedCars.map((car, index) => (
                    <div
                      key={car.id}
                      className="glass-card p-5 animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mauve/20 to-cyan-light/20 flex items-center justify-center">
                          <svg className="w-6 h-6 text-mauve" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                          </svg>
                        </div>
                        <button 
                          onClick={() => handleRemoveCar(car.id)}
                          className="text-yellow-500 hover:text-yellow-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      </div>
                      <h3 className="font-semibold text-primary mb-1">{car.car_name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold gradient-text">
                          {(car.car_data as { price?: string })?.price || "Price TBD"}
                        </span>
                      </div>
                      {editingNote === car.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            className="w-full bg-white rounded-lg p-2 text-sm text-primary border border-slate-200 resize-none outline-none focus:border-mauve"
                            rows={2}
                            placeholder="Add a note..."
                          />
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleUpdateNote(car.id)}
                              className="text-xs px-2 py-1 bg-mauve/20 text-primary rounded"
                            >
                              Save
                            </button>
                            <button 
                              onClick={() => {
                                setEditingNote(null);
                                setNoteText("");
                              }}
                              className="text-xs px-2 py-1 text-slate-500"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : car.note ? (
                        <div 
                          className="bg-slate-50 rounded-lg p-2 text-sm text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors"
                          onClick={() => {
                            setEditingNote(car.id);
                            setNoteText(car.note || "");
                          }}
                        >
                          {car.note}
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setEditingNote(car.id);
                            setNoteText("");
                          }}
                          className="text-sm text-slate-400 hover:text-primary transition-colors"
                        >
                          + Add note
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-12 text-center">
                  <p className="text-slate-500 mb-4">No saved vehicles yet</p>
                  <p className="text-sm text-slate-400">Star vehicles from search results to save them here</p>
                </div>
              )}
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === "alerts" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary">Notifications</h2>
                <button className="text-sm text-slate-500 hover:text-primary transition-colors">
                  Mark all read
                </button>
              </div>

              {mockAlerts.map((alert, index) => (
                <div
                  key={alert.id}
                  className="glass-card p-5 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      alert.type === "price_drop" 
                        ? "bg-green-100" 
                        : alert.type === "new_listing"
                        ? "bg-blue-100"
                        : "bg-purple-100"
                    }`}>
                      <AlertIcon type={alert.type} />
                    </div>
                    <div className="flex-1">
                      <p className="text-primary font-medium">{alert.message}</p>
                      <p className="text-sm text-slate-500 mt-1">{formatTimeDate(alert.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="glass-card p-5 border-2 border-dashed border-slate-200">
                <h3 className="font-medium text-primary mb-2">Set Up More Alerts</h3>
                <p className="text-sm text-slate-500 mb-3">Get notified when prices drop or new vehicles match your criteria.</p>
                <button 
                  onClick={() => setShowComingSoon(true)}
                  className="text-sm font-medium gradient-text hover:underline"
                >
                  Configure Alerts →
                </button>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary">Your Preferences</h2>
                <button 
                  onClick={handleSavePreferences}
                  disabled={savingPrefs}
                  className="text-sm px-4 py-2 bg-gradient-to-r from-mauve to-cyan-light text-primary font-semibold rounded-xl disabled:opacity-50"
                >
                  {savingPrefs ? "Saving..." : "Save Changes"}
                </button>
              </div>

              {/* Location Settings */}
              <div className="glass-card p-6">
                <h3 className="font-semibold text-primary mb-4">Location & Search Radius</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-slate-500 mb-1 block">City</label>
                    <input
                      type="text"
                      value={preferences.city || ""}
                      onChange={(e) => setPreferences({...preferences, city: e.target.value})}
                      placeholder="Los Angeles"
                      className="w-full bg-white/50 rounded-xl px-4 py-2 text-primary border border-slate-200/50 focus:border-mauve outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-500 mb-1 block">State</label>
                    <select
                      value={preferences.state || ""}
                      onChange={(e) => setPreferences({...preferences, state: e.target.value})}
                      className="w-full bg-white/50 rounded-xl px-4 py-2 text-primary border border-slate-200/50 focus:border-mauve outline-none"
                    >
                      <option value="">Select state</option>
                      {["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-500 mb-1 block">ZIP Code</label>
                    <input
                      type="text"
                      value={preferences.zip_code || ""}
                      onChange={(e) => setPreferences({...preferences, zip_code: e.target.value.replace(/\D/g, '').slice(0, 5)})}
                      placeholder="90210"
                      maxLength={5}
                      className="w-full bg-white/50 rounded-xl px-4 py-2 text-primary border border-slate-200/50 focus:border-mauve outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-500 mb-2 block">
                    Search Radius: <span className="font-medium text-primary">{preferences.search_radius || 50} miles</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={preferences.search_radius || 50}
                    onChange={(e) => setPreferences({...preferences, search_radius: parseInt(e.target.value)})}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-mauve"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>10 mi</span>
                    <span>100 mi</span>
                    <span>250 mi</span>
                    <span>500 mi</span>
                  </div>
                </div>
              </div>

              {/* Budget Range */}
              <div className="glass-card p-6">
                <h3 className="font-semibold text-primary mb-4">Budget Range</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-sm text-slate-500 mb-1 block">Minimum</label>
                    <input
                      type="text"
                      value={`$${(preferences.budget_min || 0).toLocaleString()}`}
                      onChange={(e) => setPreferences({...preferences, budget_min: parseInt(e.target.value.replace(/\D/g, '')) || 0})}
                      className="w-full bg-white/50 rounded-xl px-4 py-2 text-primary border border-slate-200/50 focus:border-mauve outline-none"
                    />
                  </div>
                  <span className="text-slate-400 mt-6">to</span>
                  <div className="flex-1">
                    <label className="text-sm text-slate-500 mb-1 block">Maximum</label>
                    <input
                      type="text"
                      value={`$${(preferences.budget_max || 0).toLocaleString()}`}
                      onChange={(e) => setPreferences({...preferences, budget_max: parseInt(e.target.value.replace(/\D/g, '')) || 0})}
                      className="w-full bg-white/50 rounded-xl px-4 py-2 text-primary border border-slate-200/50 focus:border-mauve outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Body Types */}
              <div className="glass-card p-6">
                <h3 className="font-semibold text-primary mb-4">Preferred Body Types</h3>
                <div className="flex flex-wrap gap-2">
                  {["SUV", "Crossover", "Sedan", "Truck", "Minivan", "Coupe", "Hatchback"].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        const current = preferences.body_types || [];
                        const updated = current.includes(type)
                          ? current.filter(t => t !== type)
                          : [...current, type];
                        setPreferences({ ...preferences, body_types: updated });
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        (preferences.body_types || []).includes(type)
                          ? "bg-gradient-to-r from-mauve to-thistle text-primary"
                          : "bg-white/50 text-slate-600 hover:bg-white/80"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Types */}
              <div className="glass-card p-6">
                <h3 className="font-semibold text-primary mb-4">Fuel Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {["Gas", "Hybrid", "Electric", "Plug-in Hybrid", "Diesel"].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        const current = preferences.fuel_types || [];
                        const updated = current.includes(type)
                          ? current.filter(t => t !== type)
                          : [...current, type];
                        setPreferences({ ...preferences, fuel_types: updated });
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        (preferences.fuel_types || []).includes(type)
                          ? "bg-gradient-to-r from-mauve to-thistle text-primary"
                          : "bg-white/50 text-slate-600 hover:bg-white/80"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Must-Haves */}
              <div className="glass-card p-6">
                <h3 className="font-semibold text-primary mb-4">Must-Have Features</h3>
                <div className="flex flex-wrap gap-2">
                  {(preferences.must_haves || []).map((feature) => (
                    <span key={feature} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm">
                      {feature}
                    </span>
                  ))}
                  <button className="px-3 py-1.5 bg-white/50 text-slate-500 rounded-lg text-sm hover:bg-white/80">
                    + Add
                  </button>
                </div>
              </div>

              {/* Dealbreakers */}
              <div className="glass-card p-6">
                <h3 className="font-semibold text-primary mb-4">Dealbreakers</h3>
                <div className="flex flex-wrap gap-2">
                  {(preferences.dealbreakers || []).map((item) => (
                    <span key={item} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm">
                      {item}
                    </span>
                  ))}
                  <button className="px-3 py-1.5 bg-white/50 text-slate-500 rounded-lg text-sm hover:bg-white/80">
                    + Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Market Insights Tab */}
          {activeTab === "insights" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary">Market Insights</h2>
                <span className="text-sm text-slate-500">Personalized for you</span>
              </div>

              {mockInsights.map((insight, index) => (
                <div
                  key={insight.id}
                  className="glass-card p-6 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-mauve/20 to-cyan-light/20 flex items-center justify-center">
                      <InsightIcon type={insight.icon} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">{insight.title}</h3>
                      <p className="text-slate-600">{insight.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Quick Stats */}
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="glass-card p-5 text-center">
                  <p className="text-3xl font-bold gradient-text mb-1">-3.2%</p>
                  <p className="text-sm text-slate-500">SUV prices this month</p>
                </div>
                <div className="glass-card p-5 text-center">
                  <p className="text-3xl font-bold gradient-text mb-1">47</p>
                  <p className="text-sm text-slate-500">New listings near you</p>
                </div>
                <div className="glass-card p-5 text-center">
                  <p className="text-3xl font-bold gradient-text mb-1">Good</p>
                  <p className="text-sm text-slate-500">Time to buy rating</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Coming Soon Popup */}
      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowComingSoon(false)}
          />
          <div className="relative glass-card p-8 max-w-md w-full text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-mauve/20 to-cyan-light/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-mauve" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Coming Soon</h3>
            <p className="text-slate-600 mb-6">
              Custom alert configuration is on its way. Soon you'll be able to set up personalized notifications for price drops, new listings, and market changes.
            </p>
            <button
              onClick={() => setShowComingSoon(false)}
              className="px-6 py-3 bg-gradient-to-r from-mauve to-cyan-light text-primary font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
