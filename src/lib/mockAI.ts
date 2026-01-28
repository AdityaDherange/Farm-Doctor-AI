// Mock AI analysis for disease detection
// Will be replaced with TensorFlow.js model integration

import { DISEASE_CLASSES } from "./crops";

export interface AnalysisResult {
  disease: string;
  confidence: number;
  severity: "healthy" | "low" | "medium" | "high" | "severe";
  explanation: string;
  treatment: {
    chemical: string;
    organic: string;
  };
  preventionTips: string[];
}

// Simulated delay to mimic model inference
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function analyzeDisease(crop: string, _imageData?: string): Promise<AnalysisResult> {
  // Simulate processing time
  await delay(1500 + Math.random() * 1000);

  const diseases = DISEASE_CLASSES[crop] || ["Unknown Disease", "Healthy"];
  const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
  const isHealthy = randomDisease === "Healthy";

  const confidence = isHealthy
    ? 0.85 + Math.random() * 0.14
    : 0.65 + Math.random() * 0.3;

  const severityMap: Record<number, "healthy" | "low" | "medium" | "high" | "severe"> = {
    0: "healthy",
    1: "low",
    2: "medium",
    3: "high",
    4: "severe",
  };

  const severity = isHealthy
    ? "healthy"
    : severityMap[Math.floor(Math.random() * 4) + 1];

  const treatments: Record<string, { chemical: string; organic: string }> = {
    "Apple Scab": {
      chemical: "Apply Captan or Myclobutanil fungicide",
      organic: "Neem oil spray, remove fallen leaves",
    },
    "Black Rot": {
      chemical: "Mancozeb or Copper-based fungicide",
      organic: "Prune infected areas, improve air circulation",
    },
    "Early Blight": {
      chemical: "Chlorothalonil or Azoxystrobin spray",
      organic: "Copper sulfate, crop rotation",
    },
    "Late Blight": {
      chemical: "Metalaxyl or Ridomil fungicide",
      organic: "Remove infected plants, use resistant varieties",
    },
    "Bacterial Spot": {
      chemical: "Copper hydroxide spray",
      organic: "Hot water seed treatment, avoid overhead irrigation",
    },
    default: {
      chemical: "Consult local agricultural extension for specific treatment",
      organic: "Improve plant spacing, ensure proper drainage",
    },
  };

  const treatment = treatments[randomDisease] || treatments.default;

  const explanations: Record<string, string> = {
    healthy: `The ${crop} plant appears healthy with no visible signs of disease. Continue regular monitoring and maintenance.`,
    default: `Detected ${randomDisease} on your ${crop} plant. This condition is typically caused by fungal infection due to high humidity and poor air circulation. Early intervention is recommended.`,
  };

  return {
    disease: randomDisease,
    confidence: parseFloat(confidence.toFixed(4)),
    severity,
    explanation: isHealthy ? explanations.healthy : explanations.default,
    treatment,
    preventionTips: [
      "Ensure proper plant spacing for air circulation",
      "Water at the base of plants, not on leaves",
      "Remove and destroy infected plant material",
      "Rotate crops each season",
      "Use disease-resistant varieties when available",
    ],
  };
}
