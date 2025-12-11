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

// Renders text with **highlighted** parts using ember styling
function renderWithHighlights(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const highlightedText = part.slice(2, -2);
      return (
        <span key={index} className="text-ember font-semibold">
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
      <div className="min-h-screen bg-dark-950">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-light-50 mb-4">No search query</h1>
          <p className="text-light-200 mb-8">Start by telling us what car you're looking for.</p>
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-24">
        {/* AutoMate Analysis Section */}
        <FadeIn>
          <div className="surface p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-ember/20 border border-ember/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-ember" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-ember">AutoMate</h2>
                <p className="text-xs text-light-300">Here's what I found</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center gap-3 text-light-200">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-ember animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-ember animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-ember animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-sm">Analyzing your needs and finding the best matches...</span>
              </div>
            ) : data && (
              <>
                <div className="text-base md:text-lg text-light-50 leading-relaxed">
                  {renderWithHighlights(data.summary)}
                </div>
                
                {/* Refine Search Section */}
                <div className="mt-6 pt-5 border-t border-dark-700">
                  {!showRefine ? (
                    <button
                      onClick={() => setShowRefine(true)}
                      className="flex items-center gap-2 text-sm text-light-300 hover:text-ember transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Not quite right? Tell me more
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-light-200">What else should I know?</p>
                      <textarea
                        value={refineInput}
                        onChange={(e) => setRefineInput(e.target.value)}
                        placeholder="e.g., Actually I need AWD for winter, or I'd prefer something sportier..."
                        className="w-full input-dark text-sm resize-none min-h-[70px] p-3"
                        rows={2}
                        autoFocus
                      />
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleRefine}
                          disabled={!refineInput.trim()}
                          className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                        >
                          Update Results
                        </button>
                        <button
                          onClick={() => {
                            setShowRefine(false);
                            setRefineInput("");
                          }}
                          className="text-sm text-light-300 hover:text-light-50 transition-colors"
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
              <h2 className="text-2xl font-bold text-light-50">Top Picks</h2>
              <span className="text-sm text-light-300">{data.recommendations.length} recommendations</span>
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

// Simple car card - dark theme
function CarCard({ car }: { car: CarRecommendation }) {
  const profileUrl = `/car/${encodeURIComponent(car.make)}/${encodeURIComponent(car.model)}/${car.year}`;

  return (
    <Link 
      to={profileUrl}
      className="surface-interactive p-5 block"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs uppercase text-light-300 tracking-wide">{car.year}</p>
          <h3 className="text-lg font-bold text-light-50">{car.make} {car.model}</h3>
        </div>
        <span className="badge-ember text-xs flex-shrink-0">
          {car.type}
        </span>
      </div>
      
      <p className="text-xl font-bold text-ember mb-4">{car.priceRange}</p>
      
      <div className="flex flex-wrap gap-2 text-xs">
        {car.keySpecs.mpg && (
          <span className="badge bg-green-500/20 border-green-500/30 text-green-400">
            {car.keySpecs.mpg}
          </span>
        )}
        {car.keySpecs.range && (
          <span className="badge bg-blue-500/20 border-blue-500/30 text-blue-400">
            {car.keySpecs.range}
          </span>
        )}
        {car.keySpecs.horsepower && (
          <span className="badge bg-red-500/20 border-red-500/30 text-red-400">
            {car.keySpecs.horsepower}
          </span>
        )}
        <span className="badge">
          {car.keySpecs.drivetrain}
        </span>
        {car.keySpecs.seating && (
          <span className="badge">
            {car.keySpecs.seating}
          </span>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-dark-700 flex items-center justify-between text-sm">
        <span className="text-light-300">View full profile</span>
        <svg className="w-4 h-4 text-ember" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
