/**
 * NHTSA Vehicle API Service
 * Free, no authentication required
 * 
 * Endpoints:
 * - VIN Decoder: Get full specs from a VIN
 * - Safety Ratings: Crash test ratings (1-5 stars)
 * - Recalls: All recalls for a vehicle
 * - Complaints: Consumer-reported issues
 */

const NHTSA_BASE_URL = "https://vpic.nhtsa.dot.gov/api";
const NHTSA_SAFETY_URL = "https://api.nhtsa.gov/SafetyRatings";
const NHTSA_RECALLS_URL = "https://api.nhtsa.gov/recalls/recallsByVehicle";
const NHTSA_COMPLAINTS_URL = "https://api.nhtsa.gov/complaints/complaintsByVehicle";

export interface VehicleSpecs {
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
  plantCity: string;
  plantCountry: string;
  vehicleType: string;
  gvwr: string;
}

export interface SafetyRating {
  overallRating: string;
  frontalCrashRating: string;
  sideCrashRating: string;
  rolloverRating: string;
  complaints: number;
  recalls: number;
}

export interface Recall {
  campaignNumber: string;
  reportReceivedDate: string;
  component: string;
  summary: string;
  consequence: string;
  remedy: string;
  manufacturer: string;
}

export interface Complaint {
  odiNumber: string;
  dateOfIncident: string;
  component: string;
  summary: string;
  crash: boolean;
  fire: boolean;
  numberOfInjuries: number;
  numberOfDeaths: number;
}

/**
 * Decode a VIN to get vehicle specifications
 */
export async function decodeVin(vin: string): Promise<VehicleSpecs | null> {
  try {
    const response = await fetch(
      `${NHTSA_BASE_URL}/vehicles/DecodeVinValuesExtended/${vin}?format=json`
    );
    const data = await response.json();
    
    if (!data.Results || data.Results.length === 0) {
      return null;
    }

    const result = data.Results[0];
    
    return {
      make: result.Make || "",
      model: result.Model || "",
      year: parseInt(result.ModelYear) || 0,
      trim: result.Trim || "",
      bodyClass: result.BodyClass || "",
      driveType: result.DriveType || "",
      fuelType: result.FuelTypePrimary || "",
      engineCylinders: result.EngineCylinders || "",
      engineHP: result.EngineHP || "",
      engineDisplacement: result.DisplacementL || "",
      transmissionStyle: result.TransmissionStyle || "",
      doors: result.Doors || "",
      manufacturerName: result.Manufacturer || "",
      plantCity: result.PlantCity || "",
      plantCountry: result.PlantCountry || "",
      vehicleType: result.VehicleType || "",
      gvwr: result.GVWR || "",
    };
  } catch (error) {
    console.error("Error decoding VIN:", error);
    return null;
  }
}

/**
 * Get all makes (for autocomplete/selection)
 */
export async function getAllMakes(): Promise<string[]> {
  try {
    const response = await fetch(
      `${NHTSA_BASE_URL}/vehicles/GetAllMakes?format=json`
    );
    const data = await response.json();
    
    return data.Results.map((r: { Make_Name: string }) => r.Make_Name).sort();
  } catch (error) {
    console.error("Error getting makes:", error);
    return [];
  }
}

/**
 * Get models for a specific make
 */
export async function getModelsForMake(make: string): Promise<string[]> {
  try {
    const response = await fetch(
      `${NHTSA_BASE_URL}/vehicles/GetModelsForMake/${encodeURIComponent(make)}?format=json`
    );
    const data = await response.json();
    
    return data.Results.map((r: { Model_Name: string }) => r.Model_Name).sort();
  } catch (error) {
    console.error("Error getting models:", error);
    return [];
  }
}

/**
 * Get safety ratings for a vehicle
 */
export async function getSafetyRatings(
  make: string,
  model: string,
  year: number
): Promise<SafetyRating | null> {
  try {
    // First get the vehicle ID
    const searchResponse = await fetch(
      `${NHTSA_SAFETY_URL}/modelyear/${year}/make/${encodeURIComponent(make)}/model/${encodeURIComponent(model)}?format=json`
    );
    const searchData = await searchResponse.json();
    
    if (!searchData.Results || searchData.Results.length === 0) {
      return null;
    }

    const vehicleId = searchData.Results[0].VehicleId;
    
    // Then get the ratings
    const ratingsResponse = await fetch(
      `${NHTSA_SAFETY_URL}/VehicleId/${vehicleId}?format=json`
    );
    const ratingsData = await ratingsResponse.json();
    
    if (!ratingsData.Results || ratingsData.Results.length === 0) {
      return null;
    }

    const result = ratingsData.Results[0];
    
    return {
      overallRating: result.OverallRating || "Not Rated",
      frontalCrashRating: result.OverallFrontCrashRating || "Not Rated",
      sideCrashRating: result.OverallSideCrashRating || "Not Rated",
      rolloverRating: result.RolloverRating || "Not Rated",
      complaints: result.ComplaintsCount || 0,
      recalls: result.RecallsCount || 0,
    };
  } catch (error) {
    console.error("Error getting safety ratings:", error);
    return null;
  }
}

/**
 * Get recalls for a vehicle
 */
export async function getRecalls(
  make: string,
  model: string,
  year: number
): Promise<Recall[]> {
  try {
    const response = await fetch(
      `${NHTSA_RECALLS_URL}?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${year}`
    );
    const data = await response.json();
    
    if (!data.results) {
      return [];
    }

    return data.results.map((r: Record<string, unknown>) => ({
      campaignNumber: r.NHTSACampaignNumber || "",
      reportReceivedDate: r.ReportReceivedDate || "",
      component: r.Component || "",
      summary: r.Summary || "",
      consequence: r.Consequence || "",
      remedy: r.Remedy || "",
      manufacturer: r.Manufacturer || "",
    }));
  } catch (error) {
    console.error("Error getting recalls:", error);
    return [];
  }
}

/**
 * Get consumer complaints for a vehicle
 */
export async function getComplaints(
  make: string,
  model: string,
  year: number
): Promise<Complaint[]> {
  try {
    const response = await fetch(
      `${NHTSA_COMPLAINTS_URL}?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${year}`
    );
    const data = await response.json();
    
    if (!data.results) {
      return [];
    }

    return data.results.slice(0, 20).map((r: Record<string, unknown>) => ({
      odiNumber: r.odiNumber || "",
      dateOfIncident: r.dateOfIncident || "",
      component: r.components || "",
      summary: r.summary || "",
      crash: r.crash === "Y",
      fire: r.fire === "Y",
      numberOfInjuries: parseInt(r.numberOfInjuries as string) || 0,
      numberOfDeaths: parseInt(r.numberOfDeaths as string) || 0,
    }));
  } catch (error) {
    console.error("Error getting complaints:", error);
    return [];
  }
}

/**
 * Get complete vehicle data (specs + safety + recalls)
 */
export async function getVehicleData(make: string, model: string, year: number) {
  const [safetyRatings, recalls, complaints] = await Promise.all([
    getSafetyRatings(make, model, year),
    getRecalls(make, model, year),
    getComplaints(make, model, year),
  ]);

  return {
    make,
    model,
    year,
    safety: safetyRatings,
    recalls,
    complaints,
    recallCount: recalls.length,
    complaintCount: complaints.length,
  };
}

