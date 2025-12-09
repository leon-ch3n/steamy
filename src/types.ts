export type ChatRole = "user" | "agent";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

export interface CarSpec {
  year: number;
  type: string;
  drivetrain: string;
  mpg?: string;
  range?: string;
}

export interface ListingLink {
  label: string;
  url: string;
}

export interface FinancingOption {
  downPayment: string;
  monthly: string;
  term: string;
  apr: string;
}

export interface NegotiationSnapshot {
  msrp: number;
  dealerInitial: number;
  autoMateCounter: number;
  dealerFinal: number;
}

export interface Car {
  id: string;
  name: string;
  priceRange: string;
  tagline: string;
  specs: CarSpec;
  summary: string;
  pros: string[];
  cons: string[];
  listings: ListingLink[];
  titleHistory: string;
  financing: FinancingOption[];
  negotiation: NegotiationSnapshot;
}

