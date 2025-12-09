import { useEffect, useState } from "react";

interface Specs {
  make: string;
  model: string;
  year: number;
  trim: string;
  bodyClass: string;
  driveType: string;
  fuelType: string;
  engineCylinders: string;
  engineHP: string;
  engineDisplacement: string;
  transmissionStyle: string;
  doors: string;
  manufacturerName: string;
  vehicleType: string;
}

interface SpecsTableProps {
  make: string;
  model: string;
  year: number;
  vin?: string;
}

export const SpecsTable = ({ make, model, year, vin }: SpecsTableProps) => {
  const [specs, setSpecs] = useState<Specs | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If we have a VIN, fetch specs from VIN decoder
    // Otherwise, we'd need a different endpoint or show generic info
    if (vin) {
      setLoading(true);
      fetch(`/api/car/vin/${vin}`)
        .then(res => res.json())
        .then(data => setSpecs(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [vin]);

  // Show basic info if no VIN/specs available
  const displaySpecs = specs || {
    make,
    model,
    year,
    trim: "",
    bodyClass: "",
    driveType: "",
    fuelType: "",
    engineCylinders: "",
    engineHP: "",
    engineDisplacement: "",
    transmissionStyle: "",
    doors: "",
    manufacturerName: "",
    vehicleType: "",
  };

  const specRows = [
    { label: "Make", value: displaySpecs.make },
    { label: "Model", value: displaySpecs.model },
    { label: "Year", value: displaySpecs.year.toString() },
    { label: "Body Style", value: displaySpecs.bodyClass },
    { label: "Drive Type", value: displaySpecs.driveType },
    { label: "Fuel Type", value: displaySpecs.fuelType },
    { label: "Engine", value: displaySpecs.engineCylinders ? `${displaySpecs.engineCylinders} Cylinder` : "" },
    { label: "Horsepower", value: displaySpecs.engineHP ? `${displaySpecs.engineHP} HP` : "" },
    { label: "Displacement", value: displaySpecs.engineDisplacement ? `${displaySpecs.engineDisplacement}L` : "" },
    { label: "Transmission", value: displaySpecs.transmissionStyle },
    { label: "Doors", value: displaySpecs.doors },
  ].filter(row => row.value);

  if (loading) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
          <span>📋</span> Specifications
        </h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="h-4 bg-slate-200 rounded w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
        <span>📋</span> Specifications
      </h3>
      
      {specRows.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {specRows.map((row, i) => (
            <div key={i} className="flex justify-between py-3">
              <span className="text-slate-500 text-sm">{row.label}</span>
              <span className="text-primary font-medium text-sm">{row.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-center py-4">
          Detailed specifications not available. Try searching with a VIN for complete specs.
        </p>
      )}

      {!vin && (
        <div className="mt-4 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-700">
            <span className="font-medium">💡 Tip:</span> Enter a VIN to get complete specifications for a specific vehicle.
          </p>
        </div>
      )}
    </div>
  );
};

