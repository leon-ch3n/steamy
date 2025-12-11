import { Link } from "react-router-dom";
import { Car } from "../types";

interface Props {
  car: Car;
  onSelect: (car: Car) => void;
}

// Parse make and model from car name
// Handles formats like "Toyota RAV4" or "2025 Toyota RAV4 Hybrid XLE"
function parseCarName(name: string): { make: string; model: string } {
  // Remove year prefix if present (e.g., "2025 Toyota RAV4" -> "Toyota RAV4")
  const withoutYear = name.replace(/^\d{4}\s+/, "");
  const parts = withoutYear.split(" ");
  
  if (parts.length >= 2) {
    // First part is make, rest is model (but trim trim/variant for cleaner URLs)
    const make = parts[0];
    // Take just the base model name (e.g., "RAV4" from "RAV4 Hybrid XLE")
    const model = parts[1];
    return { make, model };
  }
  return { make: withoutYear, model: withoutYear };
}

/**
 * CarCard - Dark theme with sharp edges - no gradients.
 */
export const CarCard = ({ car, onSelect }: Props) => {
  const { make, model } = parseCarName(car.name);
  const profileUrl = `/car/${encodeURIComponent(make)}/${encodeURIComponent(model)}/${car.specs.year}`;

  return (
    <div className="surface-interactive w-full text-left">
      <button
        onClick={() => onSelect(car)}
        className="w-full text-left"
      >
        <div className="p-5 md:p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase text-light-300 tracking-wide mb-1">{car.specs.year}</p>
              <p className="text-lg md:text-xl font-bold text-light-50">{car.name}</p>
            </div>
            <span className="badge-ember">
              {car.specs.type}
            </span>
          </div>
          
          <p className="text-xl font-bold text-ember">{car.priceRange}</p>
          
          <div className="flex flex-wrap gap-2 text-sm">
            {car.specs.mpg && (
              <span className="badge">{car.specs.mpg} MPG</span>
            )}
            {car.specs.range && (
              <span className="badge">{car.specs.range}</span>
            )}
            <span className="badge">{car.specs.drivetrain}</span>
          </div>
          
          <div className="pt-3 border-t border-dark-700">
            <p className="text-sm text-light-200">
              <span className="text-ember font-medium">Why we picked this:</span>{" "}
              {car.tagline}
            </p>
          </div>
        </div>
      </button>
      
      {/* View Full Profile Link */}
      <div className="px-5 md:px-6 pb-5 md:pb-6">
        <Link
          to={profileUrl}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-dark-700 border border-dark-600 hover:border-ember/30 text-sm font-medium text-light-100 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          View Full Profile
        </Link>
      </div>
    </div>
  );
};
