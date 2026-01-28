// Dataset-aligned crop list matching the trained model classes
export const CROPS = [
  { id: "apple", name: "Apple", icon: "🍎" },
  { id: "blueberry", name: "Blueberry", icon: "🫐" },
  { id: "cherry", name: "Cherry", icon: "🍒" },
  { id: "corn", name: "Corn (Maize)", icon: "🌽" },
  { id: "grape", name: "Grape", icon: "🍇" },
  { id: "orange", name: "Orange", icon: "🍊" },
  { id: "peach", name: "Peach", icon: "🍑" },
  { id: "pepper", name: "Bell Pepper", icon: "🫑" },
  { id: "potato", name: "Potato", icon: "🥔" },
  { id: "raspberry", name: "Raspberry", icon: "🫐" },
  { id: "soybean", name: "Soybean", icon: "🫘" },
  { id: "squash", name: "Squash", icon: "🎃" },
  { id: "strawberry", name: "Strawberry", icon: "🍓" },
  { id: "tomato", name: "Tomato", icon: "🍅" },
  { id: "rice", name: "Rice", icon: "🌾" },
  { id: "cassava", name: "Cassava", icon: "🥔" },
] as const;

export const SOIL_TYPES = [
  "Clay",
  "Sandy",
  "Loamy",
  "Silty",
  "Peaty",
  "Chalky",
  "Saline",
] as const;

export const SEVERITY_LEVELS = [
  { id: "healthy", label: "Healthy", color: "success" },
  { id: "low", label: "Low", color: "warning" },
  { id: "medium", label: "Medium", color: "warning" },
  { id: "high", label: "High", color: "destructive" },
  { id: "severe", label: "Severe", color: "destructive" },
] as const;

// Mock disease classes from the dataset
export const DISEASE_CLASSES: Record<string, string[]> = {
  apple: ["Apple Scab", "Black Rot", "Cedar Apple Rust", "Healthy"],
  corn: ["Cercospora Leaf Spot", "Common Rust", "Northern Leaf Blight", "Healthy"],
  grape: ["Black Rot", "Esca", "Leaf Blight", "Healthy"],
  tomato: ["Bacterial Spot", "Early Blight", "Late Blight", "Leaf Mold", "Septoria Leaf Spot", "Target Spot", "Yellow Leaf Curl Virus", "Mosaic Virus", "Healthy"],
  potato: ["Early Blight", "Late Blight", "Healthy"],
  pepper: ["Bacterial Spot", "Healthy"],
  strawberry: ["Leaf Scorch", "Healthy"],
  cherry: ["Powdery Mildew", "Healthy"],
  peach: ["Bacterial Spot", "Healthy"],
  rice: ["Brown Spot", "Leaf Blast", "Healthy"],
  cassava: ["Bacterial Blight", "Brown Streak", "Green Mottle", "Mosaic Disease", "Healthy"],
};
