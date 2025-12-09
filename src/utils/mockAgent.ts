import { cars } from "../data/mockData";
import { Car, ChatMessage } from "../types";

const constraintTemplates = [
  "Keep total out-the-door near {price}.",
  "Prioritize {type} with {drivetrain}.",
  "Look for range/MPG around {efficiency}.",
  "Favor 2024+ models with strong safety tech.",
  "Avoid heavy dealer markups; target transparent fees.",
];

const normalizeQuery = (query: string) => query.toLowerCase();

const pickEfficiency = (query: string) => {
  if (query.includes("ev") || query.includes("electric")) return "300+ mile range";
  if (query.includes("hybrid")) return "38+ MPG hybrid efficiency";
  return "30+ MPG combined";
};

const pickPrice = (query: string) => {
  const number = query.match(/\$?\d{2,3}k|\d{2,3},?\d{3}/i);
  if (!number) return "a comfortable monthly number";
  return number[0].replace(/[kK]/, ",000").replace("$", "$");
};

const pickBody = (query: string) => {
  if (query.includes("suv")) return "a compact SUV footprint";
  if (query.includes("truck") || query.includes("pickup")) return "a city-friendly pickup";
  if (query.includes("sedan")) return "a sleek sedan profile";
  return "a flexible daily driver";
};

export const generateAgentResponse = (query: string): ChatMessage => {
  const normalized = normalizeQuery(query);
  const summary = `Got it—you're after ${pickBody(
    normalized,
  )} that feels smart for your budget and vibe. I'll keep it Gen Z-friendly: connected tech, good looks, and no dealership games.`;

  const constraints = constraintTemplates.map((template, index) => {
    const replacements = {
      "{price}": pickPrice(normalized),
      "{type}": pickBody(normalized),
      "{drivetrain}": normalized.includes("awd") ? "AWD for extra grip" : "solid traction",
      "{efficiency}": pickEfficiency(normalized),
    };

    return template.replace(
      /\{[^}]+\}/g,
      (match) => replacements[match as keyof typeof replacements] ?? match,
    );
  });

  return {
    id: crypto.randomUUID(),
    role: "agent",
    content: `${summary}\n\nKey constraints I'm locking in:\n• ${constraints.join("\n• ")}`,
  };
};

export const getRecommendations = (query: string): Car[] => {
  const normalized = normalizeQuery(query);
  const relevance = (car: Car) => {
    let score = 0;
    if (normalized.includes("ev") && car.specs.type.toLowerCase().includes("ev")) score += 2;
    if (normalized.includes("hybrid") && car.specs.type.toLowerCase().includes("hybrid")) score += 2;
    if (normalized.includes("suv") && car.specs.type.toLowerCase().includes("suv")) score += 2;
    if (normalized.includes("truck") && car.specs.type.toLowerCase().includes("pickup")) score += 2;
    if (normalized.includes("civic") && car.name.toLowerCase().includes("civic")) score += 3;
    if (normalized.includes("family")) score += car.specs.type.toLowerCase().includes("suv") ? 2 : 0;
    return score;
  };

  return [...cars].sort((a, b) => relevance(b) - relevance(a));
};

