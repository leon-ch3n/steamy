/**
 * Marketcheck API Service
 * Real car listings with prices from dealers
 * 
 * API Docs: https://apidocs.marketcheck.com/
 */

import dotenv from "dotenv";
dotenv.config();

const MARKETCHECK_BASE_URL = "https://mc-api.marketcheck.com/v2";
const API_KEY = process.env.MARKETCHECK_API_KEY;

export interface CarListing {
  id: string;
  vin: string;
  heading: string;
  price: number;
  msrp: number | null;
  miles: number;
  exteriorColor: string;
  interiorColor: string;
  sellerName: string;
  sellerCity: string;
  sellerState: string;
  sellerPhone: string;
  vdpUrl: string;
  photoUrls: string[];
  make: string;
  model: string;
  year: number;
  trim: string;
  bodyType: string;
  fuelType: string;
  transmission: string;
  drivetrain: string;
  engineSize: string;
  doors: number;
  isNew: boolean;
  isCertified: boolean;
  daysOnMarket: number;
}

export interface ListingsSearchParams {
  make?: string;
  model?: string;
  year?: number;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  milesMax?: number;
  bodyType?: string;
  fuelType?: string;
  city?: string;
  state?: string;
  zip?: string;
  radius?: number;
  rows?: number;
  start?: number;
  sortBy?: "price" | "miles" | "dom" | "year";
  sortOrder?: "asc" | "desc";
}

export interface MarketStats {
  averagePrice: number;
  medianPrice: number;
  minPrice: number;
  maxPrice: number;
  totalListings: number;
  averageMiles: number;
  averageDaysOnMarket: number;
}

/**
 * Search for car listings
 */
export async function searchListings(
  params: ListingsSearchParams
): Promise<{ listings: CarListing[]; total: number }> {
  if (!API_KEY) {
    console.error("Marketcheck API key not configured");
    return { listings: [], total: 0 };
  }

  try {
    const queryParams = new URLSearchParams();
    queryParams.append("api_key", API_KEY);
    
    if (params.make) queryParams.append("make", params.make);
    if (params.model) queryParams.append("model", params.model);
    if (params.year) queryParams.append("year", params.year.toString());
    if (params.yearMin) queryParams.append("year_gte", params.yearMin.toString());
    if (params.yearMax) queryParams.append("year_lte", params.yearMax.toString());
    if (params.priceMin) queryParams.append("price_gte", params.priceMin.toString());
    if (params.priceMax) queryParams.append("price_lte", params.priceMax.toString());
    if (params.milesMax) queryParams.append("miles_lte", params.milesMax.toString());
    if (params.bodyType) queryParams.append("body_type", params.bodyType);
    if (params.fuelType) queryParams.append("fuel_type", params.fuelType);
    if (params.city) queryParams.append("city", params.city);
    if (params.state) queryParams.append("state", params.state);
    if (params.zip) queryParams.append("zip", params.zip);
    if (params.radius) queryParams.append("radius", params.radius.toString());
    if (params.rows) queryParams.append("rows", params.rows.toString());
    if (params.start) queryParams.append("start", params.start.toString());
    if (params.sortBy) queryParams.append("sort_by", params.sortBy);
    if (params.sortOrder) queryParams.append("sort_order", params.sortOrder);

    const response = await fetch(
      `${MARKETCHECK_BASE_URL}/search/car/active?${queryParams.toString()}`
    );

    if (!response.ok) {
      console.error("Marketcheck API error:", response.status, await response.text());
      return { listings: [], total: 0 };
    }

    const data = await response.json();

    const listings: CarListing[] = (data.listings || []).map((l: Record<string, unknown>) => ({
      id: l.id || "",
      vin: l.vin || "",
      heading: l.heading || "",
      price: l.price || 0,
      msrp: l.msrp || null,
      miles: l.miles || 0,
      exteriorColor: l.exterior_color || "",
      interiorColor: l.interior_color || "",
      sellerName: (l.dealer as Record<string, unknown>)?.name || "",
      sellerCity: (l.dealer as Record<string, unknown>)?.city || "",
      sellerState: (l.dealer as Record<string, unknown>)?.state || "",
      sellerPhone: (l.dealer as Record<string, unknown>)?.phone || "",
      vdpUrl: l.vdp_url || "",
      photoUrls: (l.media as Record<string, unknown>)?.photo_links || [],
      make: (l.build as Record<string, unknown>)?.make || "",
      model: (l.build as Record<string, unknown>)?.model || "",
      year: (l.build as Record<string, unknown>)?.year || 0,
      trim: (l.build as Record<string, unknown>)?.trim || "",
      bodyType: (l.build as Record<string, unknown>)?.body_type || "",
      fuelType: (l.build as Record<string, unknown>)?.fuel_type || "",
      transmission: (l.build as Record<string, unknown>)?.transmission || "",
      drivetrain: (l.build as Record<string, unknown>)?.drivetrain || "",
      engineSize: (l.build as Record<string, unknown>)?.engine_size || "",
      doors: (l.build as Record<string, unknown>)?.doors || 0,
      isNew: l.inventory_type === "new",
      isCertified: l.is_certified || false,
      daysOnMarket: l.dom || 0,
    }));

    return {
      listings,
      total: data.num_found || listings.length,
    };
  } catch (error) {
    console.error("Error searching listings:", error);
    return { listings: [], total: 0 };
  }
}

/**
 * Get a single listing by ID
 */
export async function getListingById(listingId: string): Promise<CarListing | null> {
  if (!API_KEY) {
    console.error("Marketcheck API key not configured");
    return null;
  }

  try {
    const response = await fetch(
      `${MARKETCHECK_BASE_URL}/listing/${listingId}?api_key=${API_KEY}`
    );

    if (!response.ok) {
      return null;
    }

    const l = await response.json();

    return {
      id: l.id || "",
      vin: l.vin || "",
      heading: l.heading || "",
      price: l.price || 0,
      msrp: l.msrp || null,
      miles: l.miles || 0,
      exteriorColor: l.exterior_color || "",
      interiorColor: l.interior_color || "",
      sellerName: l.dealer?.name || "",
      sellerCity: l.dealer?.city || "",
      sellerState: l.dealer?.state || "",
      sellerPhone: l.dealer?.phone || "",
      vdpUrl: l.vdp_url || "",
      photoUrls: l.media?.photo_links || [],
      make: l.build?.make || "",
      model: l.build?.model || "",
      year: l.build?.year || 0,
      trim: l.build?.trim || "",
      bodyType: l.build?.body_type || "",
      fuelType: l.build?.fuel_type || "",
      transmission: l.build?.transmission || "",
      drivetrain: l.build?.drivetrain || "",
      engineSize: l.build?.engine_size || "",
      doors: l.build?.doors || 0,
      isNew: l.inventory_type === "new",
      isCertified: l.is_certified || false,
      daysOnMarket: l.dom || 0,
    };
  } catch (error) {
    console.error("Error getting listing:", error);
    return null;
  }
}

/**
 * Get market statistics for a vehicle
 */
export async function getMarketStats(
  make: string,
  model: string,
  year?: number
): Promise<MarketStats | null> {
  if (!API_KEY) {
    console.error("Marketcheck API key not configured");
    return null;
  }

  try {
    const queryParams = new URLSearchParams();
    queryParams.append("api_key", API_KEY);
    queryParams.append("make", make);
    queryParams.append("model", model);
    if (year) queryParams.append("year", year.toString());

    const response = await fetch(
      `${MARKETCHECK_BASE_URL}/stats/car?${queryParams.toString()}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      averagePrice: data.mean_price || 0,
      medianPrice: data.median_price || 0,
      minPrice: data.min_price || 0,
      maxPrice: data.max_price || 0,
      totalListings: data.num_found || 0,
      averageMiles: data.mean_miles || 0,
      averageDaysOnMarket: data.mean_dom || 0,
    };
  } catch (error) {
    console.error("Error getting market stats:", error);
    return null;
  }
}

/**
 * Decode a VIN using Marketcheck
 */
export async function decodeVinMarketcheck(vin: string): Promise<Record<string, unknown> | null> {
  if (!API_KEY) {
    console.error("Marketcheck API key not configured");
    return null;
  }

  try {
    const response = await fetch(
      `${MARKETCHECK_BASE_URL}/decode/car/${vin}/specs?api_key=${API_KEY}`
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error decoding VIN:", error);
    return null;
  }
}

