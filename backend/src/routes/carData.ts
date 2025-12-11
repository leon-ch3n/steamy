/**
 * Car Data API Routes
 * Aggregates data from NHTSA, Marketcheck, and GPT insights
 */

import { Router } from "express";
import * as nhtsa from "../services/nhtsa.js";
import * as marketcheck from "../services/marketcheck.js";
import * as carInsights from "../services/carInsights.js";
import { getCarRecommendations } from "../services/carRecommendations.js";
import OpenAI from "openai";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const router = Router();

/**
 * POST /api/car/recommendations
 * Get GPT-powered car recommendations based on user query
 */
router.post("/recommendations", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }
    const recommendations = await getCarRecommendations(query);
    res.json(recommendations);
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

/**
 * GET /api/car/makes
 * Get all car makes (for autocomplete)
 */
router.get("/makes", async (_req, res) => {
  try {
    const makes = await nhtsa.getAllMakes();
    res.json({ makes });
  } catch (error) {
    console.error("Error getting makes:", error);
    res.status(500).json({ error: "Failed to get makes" });
  }
});

/**
 * GET /api/car/models/:make
 * Get models for a specific make
 */
router.get("/models/:make", async (req, res) => {
  try {
    const models = await nhtsa.getModelsForMake(req.params.make);
    res.json({ models });
  } catch (error) {
    console.error("Error getting models:", error);
    res.status(500).json({ error: "Failed to get models" });
  }
});

/**
 * GET /api/car/vin/:vin
 * Decode a VIN to get vehicle specs
 */
router.get("/vin/:vin", async (req, res) => {
  try {
    const specs = await nhtsa.decodeVin(req.params.vin);
    if (!specs) {
      return res.status(404).json({ error: "VIN not found or invalid" });
    }
    res.json(specs);
  } catch (error) {
    console.error("Error decoding VIN:", error);
    res.status(500).json({ error: "Failed to decode VIN" });
  }
});

/**
 * GET /api/car/safety/:make/:model/:year
 * Get safety ratings, recalls, and complaints
 */
router.get("/safety/:make/:model/:year", async (req, res) => {
  try {
    const { make, model, year } = req.params;
    const data = await nhtsa.getVehicleData(make, model, parseInt(year));
    res.json(data);
  } catch (error) {
    console.error("Error getting safety data:", error);
    res.status(500).json({ error: "Failed to get safety data" });
  }
});

/**
 * GET /api/car/insights/:make/:model/:year?
 * Get GPT-generated community insights
 */
router.get("/insights/:make/:model/:year?", async (req, res) => {
  try {
    const { make, model, year } = req.params;
    const insights = await carInsights.getCarInsights(
      make,
      model,
      year ? parseInt(year) : undefined
    );
    if (!insights) {
      return res.status(500).json({ error: "Failed to generate insights" });
    }
    res.json(insights);
  } catch (error) {
    console.error("Error getting insights:", error);
    res.status(500).json({ error: "Failed to get insights" });
  }
});

/**
 * POST /api/car/compare
 * Compare multiple vehicles
 * Body: { vehicles: [{ make, model, year? }, ...] }
 */
router.post("/compare", async (req, res) => {
  try {
    const { vehicles } = req.body;
    if (!vehicles || !Array.isArray(vehicles) || vehicles.length < 2) {
      return res.status(400).json({ error: "Need at least 2 vehicles to compare" });
    }
    const comparison = await carInsights.compareVehicles(vehicles);
    if (!comparison) {
      return res.status(500).json({ error: "Failed to compare vehicles" });
    }
    res.json(comparison);
  } catch (error) {
    console.error("Error comparing vehicles:", error);
    res.status(500).json({ error: "Failed to compare vehicles" });
  }
});

/**
 * GET /api/car/listings
 * Search for car listings
 * Query params: make, model, year, priceMin, priceMax, zip, radius, etc.
 */
router.get("/listings", async (req, res) => {
  try {
    const params: marketcheck.ListingsSearchParams = {
      make: req.query.make as string,
      model: req.query.model as string,
      year: req.query.year ? parseInt(req.query.year as string) : undefined,
      yearMin: req.query.yearMin ? parseInt(req.query.yearMin as string) : undefined,
      yearMax: req.query.yearMax ? parseInt(req.query.yearMax as string) : undefined,
      priceMin: req.query.priceMin ? parseInt(req.query.priceMin as string) : undefined,
      priceMax: req.query.priceMax ? parseInt(req.query.priceMax as string) : undefined,
      milesMax: req.query.milesMax ? parseInt(req.query.milesMax as string) : undefined,
      bodyType: req.query.bodyType as string,
      fuelType: req.query.fuelType as string,
      zip: req.query.zip as string,
      radius: req.query.radius ? parseInt(req.query.radius as string) : 50,
      rows: req.query.rows ? parseInt(req.query.rows as string) : 20,
      sortBy: req.query.sortBy as "price" | "miles" | "dom" | "year",
      sortOrder: req.query.sortOrder as "asc" | "desc",
    };

    const result = await marketcheck.searchListings(params);
    res.json(result);
  } catch (error) {
    console.error("Error searching listings:", error);
    res.status(500).json({ error: "Failed to search listings" });
  }
});

/**
 * GET /api/car/listing/:id
 * Get a specific listing by ID
 */
router.get("/listing/:id", async (req, res) => {
  try {
    const listing = await marketcheck.getListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
  } catch (error) {
    console.error("Error getting listing:", error);
    res.status(500).json({ error: "Failed to get listing" });
  }
});

/**
 * GET /api/car/market-stats/:make/:model/:year?
 * Get market statistics for a vehicle
 */
router.get("/market-stats/:make/:model/:year?", async (req, res) => {
  try {
    const { make, model, year } = req.params;
    const stats = await marketcheck.getMarketStats(
      make,
      model,
      year ? parseInt(year) : undefined
    );
    if (!stats) {
      return res.status(404).json({ error: "No market data found" });
    }
    res.json(stats);
  } catch (error) {
    console.error("Error getting market stats:", error);
    res.status(500).json({ error: "Failed to get market stats" });
  }
});

/**
 * GET /api/car/places/geocode?query=
 * Geocode a location string to get postal code, city, state, lat/lng
 */
router.get("/places/geocode", async (req, res) => {
  try {
    const query = req.query.query as string;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!query) return res.status(400).json({ error: "query is required" });
    if (!apiKey) return res.status(500).json({ error: "GOOGLE_PLACES_API_KEY is not configured on the backend." });

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      query
    )}&key=${apiKey}`;

    const resp = await fetch(url);
    if (!resp.ok) {
      return res.status(500).json({ error: "Failed to geocode" });
    }

    const data = (await resp.json()) as any;
    const first = data.results?.[0];
    if (!first) {
      return res.status(404).json({ error: "No results found" });
    }

    const components = first.address_components || [];
    const getComponent = (type: string) =>
      components.find((c: any) => (c.types || []).includes(type));

    const postal = getComponent("postal_code")?.long_name || "";
    const city =
      getComponent("locality")?.long_name ||
      getComponent("sublocality")?.long_name ||
      "";
    const state =
      getComponent("administrative_area_level_1")?.short_name ||
      getComponent("administrative_area_level_1")?.long_name ||
      "";
    const { lat, lng } = first.geometry?.location || {};

    res.json({
      postalCode: postal,
      city,
      state,
      lat,
      lng,
      formattedAddress: first.formatted_address,
    });
  } catch (error) {
    console.error("Error geocoding:", error);
    res.status(500).json({ error: "Failed to geocode" });
  }
});

/**
 * POST /api/car/listing/score
 * Score a specific listing using GPT (deal score placeholder)
 * Body: { listing: { ... } }
 */
router.post("/listing/score", async (req, res) => {
  try {
    const { listing } = req.body;
    if (!listing) {
      return res.status(400).json({ error: "listing is required" });
    }

    const prompt = `You are a car deal rater. Score this listing from 0-100 where 100 is an exceptional deal, based on price, miles, condition (new/used/CPO), and general market norms. Output JSON only.
Listing data:
${JSON.stringify(listing, null, 2)}

Respond as:
{
  "score": 0-100,
  "verdict": "short verdict string",
  "reasons": ["bullet1", "bullet2", "bullet3"]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You rate car listings on deal quality; be concise and numeric." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(content);
    res.json(parsed);
  } catch (error) {
    console.error("Error scoring listing:", error);
    res.status(500).json({
      score: 50,
      verdict: "Unable to score right now",
      reasons: ["Fallback score used", "Try again later"],
    });
  }
});

/**
 * GET /api/car/more-listings/:make/:model/:year
 * Get more listings with pagination support
 */
router.get("/more-listings/:make/:model/:year", async (req, res) => {
  try {
    const { make, model, year } = req.params;
    const yearNum = parseInt(year);
    const zip = (req.query.zip as string) || undefined;
    const radius = req.query.radius ? parseInt(req.query.radius as string) : 50;
    const start = req.query.start ? parseInt(req.query.start as string) : 0;
    const rows = req.query.rows ? parseInt(req.query.rows as string) : 10;

    console.log(`[MoreListings] Fetching listings for ${make} ${model} ${year}, start=${start}, rows=${rows}`);

    const result = await marketcheck.searchListings({
      make,
      model,
      year: yearNum,
      rows,
      start,
      ...(zip ? { zip, radius } : {}),
    });

    res.json({
      listings: result.listings,
      total: result.total,
      hasMore: start + rows < result.total,
    });
  } catch (error) {
    console.error("Error getting more listings:", error);
    res.status(500).json({ error: "Failed to get more listings" });
  }
});

/**
 * GET /api/car/profile/:make/:model/:year
 * Get complete car profile (aggregates all data sources)
 */
router.get("/profile/:make/:model/:year", async (req, res) => {
  try {
    const { make, model, year } = req.params;
    const yearNum = parseInt(year);
    const zip = (req.query.zip as string) || undefined;
    const radius = req.query.radius ? parseInt(req.query.radius as string) : undefined;

    // Fetch all data in parallel (first pass with zip/radius if provided)
    const [safetyData, insights, marketStats, listings] = await Promise.all([
      nhtsa.getVehicleData(make, model, yearNum),
      carInsights.getCarInsights(make, model, yearNum),
      marketcheck.getMarketStats(make, model, yearNum),
      marketcheck.searchListings({
        make,
        model,
        year: yearNum,
        rows: 10,
        ...(zip ? { zip } : {}),
        radius: radius ?? 50,
      }),
    ]);

    // If zero listings with provided location, widen radius incrementally (keep ZIP) up to 200 miles
    let listingResult = listings;
    let searchNote: string | undefined;
    
    if ((listings?.total || 0) === 0 && zip) {
      console.log(`[CarProfile] No listings found for ${make} ${model} ${year} at ZIP ${zip} with radius ${radius || 50}. Widening search...`);
      
      const widenSteps = [50, 100, 200];
      for (const r of widenSteps) {
        if (radius && r <= radius) continue;
        const widened = await marketcheck.searchListings({
          make,
          model,
          year: yearNum,
          rows: 10,
          zip,
          radius: r,
        });
        console.log(`[CarProfile] Widened to ${r} miles: found ${widened?.total || 0} listings`);
        if ((widened?.total || 0) > 0) {
          listingResult = widened;
          searchNote = `Showing listings within ${r} miles`;
          break;
        }
      }
      
      // If still no results after widening, fall back to nationwide search (no ZIP filter)
      if ((listingResult?.total || 0) === 0) {
        console.log(`[CarProfile] No listings found within 200 miles of ZIP ${zip}. Falling back to nationwide search...`);
        const nationwideResults = await marketcheck.searchListings({
          make,
          model,
          year: yearNum,
          rows: 10,
          // No zip or radius - nationwide search
        });
        console.log(`[CarProfile] Nationwide search found ${nationwideResults?.total || 0} listings`);
        if ((nationwideResults?.total || 0) > 0) {
          listingResult = nationwideResults;
          searchNote = `No listings near your location. Showing nationwide results.`;
        }
      }
    }

    res.json({
      make,
      model,
      year: yearNum,
      safety: safetyData,
      insights,
      marketStats,
      sampleListings: listingResult.listings,
      totalListings: listingResult.total,
      searchNote, // Let frontend know if we had to widen/fall back
    });
  } catch (error) {
    console.error("Error getting car profile:", error);
    res.status(500).json({ error: "Failed to get car profile" });
  }
});

export default router;

