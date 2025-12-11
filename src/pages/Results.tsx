import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { saveSearch } from "../lib/supabase";
import { apiFetch } from "../lib/api";
import { FadeIn } from "../components/ui/FadeIn";
import logoImg from "../Screenshot_2025-12-08_at_1.37.15_PM-removebg-preview.png";

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
        <span key={index} className="font-semibold text-primary">
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
        const response = await apiFetch("/api/car/recommendations", {
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
          <Link to="/" className="px-6 py-3 bg-gradient-to-r from-mauve to-cyan-light text-primary font-semibold rounded-xl hover:shadow-lg transition-all">
            Go Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-24">
        {/* AutoMate Analysis Section */}
        <FadeIn>
          <div className="glass-card p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <img src={logoImg} alt="AutoMate" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">AutoMate</h2>
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
                        className="w-full bg-white/50 border border-slate-200 rounded-xl text-sm resize-none min-h-[70px] p-3 text-primary placeholder:text-slate-400 focus:outline-none focus:border-mauve"
                        rows={2}
                        autoFocus
                      />
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleRefine}
                          disabled={!refineInput.trim()}
                          className="px-4 py-2 bg-gradient-to-r from-mauve to-cyan-light text-primary font-semibold rounded-xl text-sm hover:shadow-lg transition-all disabled:opacity-50"
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
        </FadeIn>

        {/* Car Cards Section */}
        {!loading && data && data.recommendations.length > 0 && (
          <FadeIn delay={0.1}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">Top Picks</h2>
              <span className="text-sm text-slate-500">{data.recommendations.length} recommendations</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.recommendations.map((car, index) => (
                <FadeIn key={`${car.make}-${car.model}-${car.year}-${index}`} delay={0.05 * index}>
                  <CarCard car={car} />
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        )}
      </main>

      <Footer />
    </div>
  );
};

// Car card - glass theme
function CarCard({ car }: { car: CarRecommendation }) {
  const profileUrl = `/car/${encodeURIComponent(car.make)}/${encodeURIComponent(car.model)}/${car.year}`;

  return (
    <Link 
      to={profileUrl}
      className="glass-card p-5 block hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs uppercase text-slate-500 tracking-wide">{car.year}</p>
          <h3 className="text-lg font-bold text-primary">{car.make} {car.model}</h3>
        </div>
        <span className="px-2 py-1 bg-gradient-to-r from-mauve/30 to-thistle/30 text-primary text-xs font-medium rounded-lg flex-shrink-0">
          {car.type}
        </span>
      </div>
      
      <p className="text-xl font-bold gradient-text mb-4">{car.priceRange}</p>
      
      <div className="flex flex-wrap gap-2 text-xs">
        {car.keySpecs.mpg && (
          <span className="px-2 py-1 bg-green-100 border border-green-200 text-green-700 rounded-lg">
            {car.keySpecs.mpg}
          </span>
        )}
        {car.keySpecs.range && (
          <span className="px-2 py-1 bg-blue-100 border border-blue-200 text-blue-700 rounded-lg">
            {car.keySpecs.range}
          </span>
        )}
        {car.keySpecs.horsepower && (
          <span className="px-2 py-1 bg-red-100 border border-red-200 text-red-700 rounded-lg">
            {car.keySpecs.horsepower}
          </span>
        )}
        <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg">
          {car.keySpecs.drivetrain}
        </span>
        {car.keySpecs.seating && (
          <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg">
            {car.keySpecs.seating}
          </span>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-sm">
        <span className="text-slate-500">View full profile</span>
        <svg className="w-4 h-4 text-mauve" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
