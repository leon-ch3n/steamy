import { Car } from "../types";

export const cars: Car[] = [
  {
    id: "civic-ex",
    name: "2024 Honda Civic EX",
    priceRange: "$23,800 – $25,500 estimated OTD",
    tagline: "Balanced, efficient daily driver with strong resale value.",
    specs: {
      year: 2024,
      type: "Compact",
      drivetrain: "FWD",
      mpg: "33 city / 42 hwy",
    },
    summary:
      "A practical, comfortable compact with excellent fuel economy and tech that suits urban driving plus weekend trips.",
    pros: [
      "Top-tier fuel efficiency and low maintenance costs",
      "Honda Sensing safety suite standard",
      "Solid resale value and easy nationwide serviceability",
    ],
    cons: [
      "Not the quickest in its class",
      "Cabin is quiet but not luxury-grade",
    ],
    listings: [
      { label: "Metro Honda - Inventory", url: "https://dealer-demo.com/honda-civic" },
      { label: "AutoTrader Snapshot", url: "https://autotrader-demo.com/civic-ex" },
      { label: "CarGurus Price Check", url: "https://cargurus-demo.com/civic" },
    ],
    titleHistory: "Clean title, 1 previous owner, no reported accidents (simulated).",
    financing: [
      { downPayment: "$2,500", monthly: "$358/mo", term: "36 mo", apr: "3.1% APR" },
      { downPayment: "$4,000", monthly: "$305/mo", term: "36 mo", apr: "3.1% APR" },
    ],
    negotiation: {
      msrp: 25500,
      dealerInitial: 24800,
      autoMateCounter: 23750,
      dealerFinal: 24100,
    },
  },
  {
    id: "rav4-hybrid",
    name: "2025 Toyota RAV4 Hybrid XLE",
    priceRange: "$31,900 – $35,200 estimated OTD",
    tagline: "City-friendly SUV with hybrid efficiency and family-first safety.",
    specs: {
      year: 2025,
      type: "Compact SUV",
      drivetrain: "AWD (hybrid)",
      mpg: "41 city / 38 hwy",
    },
    summary:
      "A do-it-all hybrid crossover: roomy for a family of four, great mileage, and Toyota reliability with strong resale.",
    pros: [
      "Excellent fuel economy for an SUV",
      "Spacious cargo and rear seats",
      "Toyota Safety Sense 3.0 standard",
    ],
    cons: [
      "Infotainment UI is improving but still utilitarian",
      "Waitlists exist in some regions",
    ],
    listings: [
      { label: "SoCal Toyota - Hybrid Stock", url: "https://dealer-demo.com/rav4-hybrid" },
      { label: "Edmunds Pricing", url: "https://edmunds-demo.com/rav4" },
      { label: "KBB Fair Market", url: "https://kbb-demo.com/rav4-hybrid" },
    ],
    titleHistory: "Clean title, new model year allocation (simulated).",
    financing: [
      { downPayment: "$3,500", monthly: "$468/mo", term: "48 mo", apr: "3.4% APR" },
      { downPayment: "$5,000", monthly: "$419/mo", term: "48 mo", apr: "3.4% APR" },
    ],
    negotiation: {
      msrp: 35200,
      dealerInitial: 34200,
      autoMateCounter: 32950,
      dealerFinal: 33400,
    },
  },
  {
    id: "ioniq6",
    name: "2025 Hyundai Ioniq 6 SE AWD",
    priceRange: "$38,500 – $42,000 estimated OTD",
    tagline: "Sleek EV sedan with long range and playful design cues.",
    specs: {
      year: 2025,
      type: "EV Sedan",
      drivetrain: "AWD",
      range: "320 mi EPA est.",
    },
    summary:
      "A futuristic EV with great aerodynamics, strong range, and fast charging—ideal for first-time EV owners who want style.",
    pros: [
      "320-mile range with 800V fast charging",
      "Modern cabin with ambient lighting",
      "Competitive EV incentives in many states",
    ],
    cons: [
      "Trunk opening is sedan-style, not hatchback",
      "Ride is tuned more for efficiency than sport",
    ],
    listings: [
      { label: "EV Direct - Ioniq 6", url: "https://evdirect-demo.com/ioniq6" },
      { label: "Recurrent Battery Health", url: "https://recurrent-demo.com/ioniq6" },
      { label: "Cars.com EV Deals", url: "https://cars-demo.com/ioniq6" },
    ],
    titleHistory: "Clean title, demo fleet unit, no reported accidents (simulated).",
    financing: [
      { downPayment: "$4,500", monthly: "$529/mo", term: "48 mo", apr: "2.9% APR" },
      { downPayment: "$6,000", monthly: "$488/mo", term: "48 mo", apr: "2.9% APR" },
    ],
    negotiation: {
      msrp: 42000,
      dealerInitial: 40900,
      autoMateCounter: 39500,
      dealerFinal: 39950,
    },
  },
  {
    id: "maverick-hybrid",
    name: "2024 Ford Maverick Hybrid XLT",
    priceRange: "$27,900 – $30,400 estimated OTD",
    tagline: "Compact pickup with hybrid efficiency for city meets weekend projects.",
    specs: {
      year: 2024,
      type: "Compact Pickup",
      drivetrain: "FWD (Hybrid)",
      mpg: "40 city / 33 hwy",
    },
    summary:
      "A small pickup that fits city parking but still hauls gear. Hybrid drivetrain keeps fuel costs low while giving light truck utility.",
    pros: [
      "Unique mix of truck utility and hybrid MPG",
      "DIY-friendly bed and FLEXBED accessories",
      "Budget-friendly entry price",
    ],
    cons: [
      "High demand can create markups",
      "Cab materials are durable but simple",
    ],
    listings: [
      { label: "City Ford - Maverick", url: "https://dealer-demo.com/maverick" },
      { label: "Cars & Bids Snapshot", url: "https://carsandbids-demo.com/maverick" },
      { label: "KBB Market", url: "https://kbb-demo.com/maverick-hybrid" },
    ],
    titleHistory: "Clean title, fleet return, no reported accidents (simulated).",
    financing: [
      { downPayment: "$3,000", monthly: "$389/mo", term: "48 mo", apr: "3.5% APR" },
      { downPayment: "$4,500", monthly: "$341/mo", term: "48 mo", apr: "3.5% APR" },
    ],
    negotiation: {
      msrp: 30400,
      dealerInitial: 29750,
      autoMateCounter: 28700,
      dealerFinal: 29150,
    },
  },
];

