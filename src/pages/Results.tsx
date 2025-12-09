import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { saveSearch } from "../lib/supabase";

interface CarRecommendation {
  name: string;
  make: string;
  model: string;
  year: number;
  priceRange: string;
  type: string;
  keySpecs: {
    mpg?: string;
    range?: string;
    drivetrain: string;
    seating?: string;
    horsepower?: string;
  };
}

interface RecommendationResponse {
  summary: string;
  recommendations: CarRecommendation[];
}

// Renders text with **highlighted** parts using gradient styling
function renderWithHighlights(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const highlightedText = part.slice(2, -2);
      return (
        <span key={index} className="gradient-text font-semibold">
          {highlightedText}
        </span>
      );
    }
    return part;
  });
}

export const Results = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const query = searchParams.get("q") || "";
  const searchSavedRef = useRef(false);
  
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRefine, setShowRefine] = useState(false);
  const [refineInput, setRefineInput] = useState("");

  useEffect(() => {
    if (!query) return;
    
    setLoading(true);
    searchSavedRef.current = false;

    const fetchRecommendations = async () => {
      try {
        const response = await fetch("/api/car/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) throw new Error("Failed to get recommendations");

        const result: RecommendationResponse = await response.json();
        setData(result);
        
        if (user && !searchSavedRef.current) {
          searchSavedRef.current = true;
          saveSearch(user.id, query, result.recommendations.length);
        }
      } catch (error) {
        console.error("Error:", error);
        setData({
          summary: "I've analyzed your needs and found some great options below!",
          recommendations: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [query, user]);

  const handleRefine = () => {
    if (!refineInput.trim()) return;
    const newQuery = `${query}. Additional info: ${refineInput.trim()}`;
    navigate(`/results?q=${encodeURIComponent(newQuery)}`);
    setShowRefine(false);
    setRefineInput("");
  };

  if (!query) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">No search query</h1>
          <p className="text-slate-600 mb-8">Start by telling us what car you're looking for.</p>
          <Link
            to="/"
            className="px-6 py-3 bg-gradient-to-r from-mauve to-cyan-light text-primary font-semibold rounded-2xl hover:shadow-lg transition-all"
          >
            Go Home
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-24">
        {/* AutoMate Analysis Section */}
        <div className="glass-card p-6 md:p-8 mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <svg 
              className="w-10 h-10" 
              viewBox="0 0 24 24" 
              fill="none"
            >
              <defs>
                <linearGradient id="gearGradientResults" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="50%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              <path 
                fill="url(#gearGradientResults)" 
                d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"
              />
            </svg>
            <div>
              <h2 className="text-xl font-bold gradient-text">AutoMate</h2>
              <p className="text-xs text-slate-500">Here's what I found</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 text-slate-600">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-mauve animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-mauve animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-mauve animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-sm">Analyzing your needs and finding the best matches...</span>
            </div>
          ) : data && (
            <>
              <div className="text-base md:text-lg text-primary leading-relaxed">
                {renderWithHighlights(data.summary)}
              </div>
              
              {/* Refine Search Section */}
              <div className="mt-6 pt-5 border-t border-slate-200/50">
                {!showRefine ? (
                  <button
                    onClick={() => setShowRefine(true)}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Not quite right? Tell me more
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">What else should I know?</p>
                    <textarea
                      value={refineInput}
                      onChange={(e) => setRefineInput(e.target.value)}
                      placeholder="e.g., Actually I need AWD for winter, or I'd prefer something sportier..."
                      className="w-full bg-white/50 text-sm text-primary placeholder-slate-400 resize-none outline-none min-h-[70px] rounded-xl p-3 border border-slate-200/50 focus:border-mauve transition-colors"
                      rows={2}
                      autoFocus
                    />
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleRefine}
                        disabled={!refineInput.trim()}
                        className="px-4 py-2 bg-gradient-to-r from-mauve to-cyan-light text-white text-sm font-semibold rounded-xl hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Update Results
                      </button>
                      <button
                        onClick={() => {
                          setShowRefine(false);
                          setRefineInput("");
                        }}
                        className="text-sm text-slate-500 hover:text-primary transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Car Cards Section */}
        {!loading && data && data.recommendations.length > 0 && (
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">Top Picks</h2>
              <span className="text-sm text-slate-500">{data.recommendations.length} recommendations</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.recommendations.map((car, index) => (
                <CarCard key={`${car.make}-${car.model}-${car.year}-${index}`} car={car} index={index} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Simple car card - no expanded details
function CarCard({ car, index }: { car: CarRecommendation; index: number }) {
  const profileUrl = `/car/${encodeURIComponent(car.make)}/${encodeURIComponent(car.model)}/${car.year}`;

  return (
    <Link 
      to={profileUrl}
      className="glass-card p-5 block hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs uppercase text-slate-500 tracking-wide">{car.year}</p>
          <h3 className="text-lg font-bold text-primary">{car.make} {car.model}</h3>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-thistle/50 to-mauve/50 text-xs font-medium text-primary flex-shrink-0">
          {car.type}
        </span>
      </div>
      
      <p className="text-xl font-bold gradient-text mb-4">{car.priceRange}</p>
      
      <div className="flex flex-wrap gap-2 text-xs">
        {car.keySpecs.mpg && (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
            {car.keySpecs.mpg}
          </span>
        )}
        {car.keySpecs.range && (
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
            {car.keySpecs.range}
          </span>
        )}
        {car.keySpecs.horsepower && (
          <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full font-medium">
            {car.keySpecs.horsepower}
          </span>
        )}
        <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
          {car.keySpecs.drivetrain}
        </span>
        {car.keySpecs.seating && (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
            {car.keySpecs.seating}
          </span>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-100/50 flex items-center justify-between text-sm">
        <span className="text-slate-500">View full profile</span>
        <svg className="w-4 h-4 text-mauve" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
