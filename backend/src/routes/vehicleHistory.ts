/**
 * Vehicle History API Routes
 * VIN-based vehicle history lookup
 * 
 * Note: In production, this would integrate with services like:
 * - Carfax API (expensive, requires partnership)
 * - AutoCheck/Experian (requires business account)
 * - VINAudit (more affordable, ~$0.10-0.50 per lookup)
 * - NMVTIS (government database)
 * 
 * For now, we use NHTSA for basic VIN decode + recalls and provide mock history data.
 */

import { Router, Request, Response } from "express";
import { decodeVin, getRecalls } from "../services/nhtsa.js";



export const vehicleHistoryRouter = Router();

interface VehicleHistory {
  vin: string;
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
    trim: string;
    engine: string;
    transmission: string;
    drivetrain: string;
    bodyType: string;
  };
  titleInfo: {
    state: string;
    type: string;
    odometer: number;
  };
  timeline: Array<{
    date: string;
    event: string;
    type: "purchase" | "service" | "accident" | "title" | "inspection" | "recall" | "other";
    details?: string;
    location?: string;
  }>;
  ownerCount: number;
  accidents: number;
  titleIssues: string[];
  recalls: Array<{
    campaignNumber: string;
    component: string;
    summary: string;
    remedy: string;
  }>;
}

/**
 * GET /api/history/:vin
 * Get vehicle history by VIN
 */
vehicleHistoryRouter.get("/:vin", async (req: Request, res: Response) => {
  try {
    const { vin } = req.params;
    
    if (!vin || vin.length !== 17) {
      return res.status(400).json({ error: "Invalid VIN. Must be 17 characters." });
    }

    // Decode VIN using NHTSA
    let vehicleInfo: VehicleHistory["vehicleInfo"] | null = null;
    try {
      const decoded = await decodeVin(vin);
      if (decoded) {
        vehicleInfo = {
          year: parseInt((decoded as any).ModelYear) || 0,
          make: (decoded as any).Make || "Unknown",
          model: (decoded as any).Model || "Unknown",
          trim: (decoded as any).Trim || "",
          engine: (decoded as any).DisplacementL ? `${(decoded as any).DisplacementL}L ${(decoded as any).FuelTypePrimary || ""}` : "",
          transmission: (decoded as any).TransmissionStyle || "",
          drivetrain: (decoded as any).DriveType || "",
          bodyType: (decoded as any).BodyClass || "",
        };
      }
    } catch (error) {
      console.error("VIN decode error:", error);
    }

    // Get recalls for this vehicle
    let recalls: VehicleHistory["recalls"] = [];
    if (vehicleInfo) {
      try {
        const recallData = await getRecalls(vehicleInfo.make, vehicleInfo.model, vehicleInfo.year);
        recalls = recallData?.slice(0, 10).map((r: any) => ({
          campaignNumber: r.NHTSACampaignNumber || "",
          component: r.Component || "",
          summary: r.Summary || "",
          remedy: r.Remedy || "",
        })) || [];
      } catch (error) {
        console.error("Recall fetch error:", error);
      }
    }

    // Generate mock history data
    // In production, this would come from a real history service
    const history = generateMockHistory(vin, vehicleInfo, recalls);
    
    res.json(history);
    
  } catch (error) {
    console.error("Error fetching vehicle history:", error);
    res.status(500).json({ error: "Failed to fetch vehicle history" });
  }
});

function generateMockHistory(
  vin: string,
  vehicleInfo: VehicleHistory["vehicleInfo"] | null,
  recalls: VehicleHistory["recalls"]
): VehicleHistory {
  const currentYear = new Date().getFullYear();
  const carYear = vehicleInfo?.year || currentYear - 3;
  const carAge = currentYear - carYear;
  
  // Generate realistic mock data based on car age
  const ownerCount = Math.min(Math.floor(carAge / 3) + 1, 4);
  const hasAccident = Math.random() > 0.85; // 15% chance of accident
  const mileage = Math.floor((carAge * 12000) + (Math.random() * 5000));
  
  const timeline: VehicleHistory["timeline"] = [];
  
  // First purchase
  timeline.push({
    date: `${carYear}-${String(Math.floor(Math.random() * 6) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    event: "Original Purchase",
    type: "purchase",
    details: `New vehicle purchased from authorized dealer`,
    location: "California",
  });
  
  // Add service records
  for (let year = carYear; year <= currentYear; year++) {
    if (year > carYear) {
      timeline.push({
        date: `${year}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-15`,
        event: "Regular Service",
        type: "service",
        details: `${(year - carYear) * 15000} mile service - oil change, tire rotation, inspection`,
        location: "California",
      });
    }
  }
  
  // Add ownership changes
  if (ownerCount > 1) {
    const transferYear = carYear + Math.floor(carAge / 2);
    timeline.push({
      date: `${transferYear}-06-01`,
      event: "Ownership Transfer",
      type: "title",
      details: "Vehicle sold to second owner",
      location: "California",
    });
  }
  
  // Add recall service if applicable
  if (recalls.length > 0) {
    timeline.push({
      date: `${Math.min(carYear + 1, currentYear)}-08-15`,
      event: "Recall Service Completed",
      type: "recall",
      details: recalls[0].component,
      location: "California",
    });
  }
  
  // Add accident if applicable
  if (hasAccident) {
    timeline.push({
      date: `${carYear + Math.floor(carAge / 2)}-03-20`,
      event: "Minor Accident Reported",
      type: "accident",
      details: "Minor collision reported - vehicle repaired",
      location: "California",
    });
  }
  
  // Sort timeline by date (newest first)
  timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return {
    vin,
    vehicleInfo: vehicleInfo || {
      year: carYear,
      make: "Unknown",
      model: "Unknown",
      trim: "",
      engine: "",
      transmission: "",
      drivetrain: "",
      bodyType: "",
    },
    titleInfo: {
      state: "CA",
      type: hasAccident ? "Rebuilt" : "Clean",
      odometer: mileage,
    },
    timeline,
    ownerCount,
    accidents: hasAccident ? 1 : 0,
    titleIssues: hasAccident ? ["Previous damage reported"] : [],
    recalls,
  };
}

