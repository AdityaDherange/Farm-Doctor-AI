import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ImageInput } from "@/components/ImageInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CROPS, SOIL_TYPES } from "@/lib/crops";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { analyzeDisease } from "@/lib/mockAI";
import { MapPin, Loader2, AlertCircle, Leaf } from "lucide-react";
import { toast } from "sonner";

export default function Detect() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { latitude, longitude, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [crop, setCrop] = useState("");
  const [variety, setVariety] = useState("");
  const [soilType, setSoilType] = useState("");
  const [soilPh, setSoilPh] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [previousCrop, setPreviousCrop] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const handleImageSelect = (file: File, preview: string) => {
    setImageFile(file);
    setImagePreview(preview);
  };

  const handleImageClear = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!crop) {
      toast.error("Please select a crop");
      return;
    }

    if (!imageFile) {
      toast.error("Please capture or upload an image");
      return;
    }

    if (!user) {
      toast.error("Please sign in to save your diagnosis");
      navigate("/login");
      return;
    }

    setAnalyzing(true);

    try {
      // Analyze disease with mock AI
      const result = await analyzeDisease(crop, imagePreview || undefined);

      // Upload image to storage
      let imageUrl = null;
      if (imageFile) {
        const fileName = `${user.id}/${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("diagnosis-images")
          .upload(fileName, imageFile);

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("diagnosis-images")
            .getPublicUrl(fileName);
          imageUrl = urlData.publicUrl;
        }
      }

      // Save diagnosis to database
      const { data: diagnosis, error } = await supabase
        .from("diagnoses")
        .insert({
          user_id: user.id,
          crop,
          variety: variety || null,
          disease: result.disease,
          severity: result.severity,
          confidence: result.confidence,
          image_url: imageUrl,
          soil_type: soilType || null,
          soil_ph: soilPh ? parseFloat(soilPh) : null,
          planting_date: plantingDate || null,
          previous_crop: previousCrop || null,
          latitude,
          longitude,
          treatment_chemical: result.treatment.chemical,
          treatment_organic: result.treatment.organic,
          explanation: result.explanation,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Analysis complete!");
      navigate(`/result/${diagnosis.id}`);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Disease Detection" />

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Image Input */}
        <section>
          <Label className="text-base font-semibold mb-3 block">
            Crop Image
          </Label>
          <ImageInput
            onImageSelect={handleImageSelect}
            preview={imagePreview}
            onClear={handleImageClear}
          />
        </section>

        {/* Location */}
        <section className="card-agricultural p-4 space-y-3">
          <Label className="text-base font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Location
          </Label>
          
          {latitude && longitude ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-success" />
              Location captured: {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </div>
          ) : geoError ? (
            <div className="flex items-center gap-2 text-sm text-warning">
              <AlertCircle className="h-4 w-4" />
              {geoError}
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={requestLocation}
              disabled={geoLoading}
              className="w-full"
            >
              {geoLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Getting location...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Get My Location
                </>
              )}
            </Button>
          )}
        </section>

        {/* Crop Selection */}
        <section className="space-y-3">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Leaf className="h-4 w-4 text-primary" />
            Crop Details
          </Label>

          <div className="space-y-4">
            <div>
              <Label htmlFor="crop" className="text-sm">Crop Type *</Label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger className="input-agricultural mt-1.5">
                  <SelectValue placeholder="Select your crop" />
                </SelectTrigger>
                <SelectContent>
                  {CROPS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="flex items-center gap-2">
                        <span>{c.icon}</span>
                        <span>{c.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="variety" className="text-sm">Variety (Optional)</Label>
              <Input
                id="variety"
                placeholder="e.g., Roma, Cherry"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="input-agricultural mt-1.5"
              />
            </div>
          </div>
        </section>

        {/* Soil Info */}
        <section className="space-y-4">
          <Label className="text-base font-semibold">Soil Information</Label>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="soilType" className="text-sm">Soil Type</Label>
              <Select value={soilType} onValueChange={setSoilType}>
                <SelectTrigger className="input-agricultural mt-1.5">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {SOIL_TYPES.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="soilPh" className="text-sm">Soil pH</Label>
              <Input
                id="soilPh"
                type="number"
                step="0.1"
                min="0"
                max="14"
                placeholder="e.g., 6.5"
                value={soilPh}
                onChange={(e) => setSoilPh(e.target.value)}
                className="input-agricultural mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="plantingDate" className="text-sm">Planting Date</Label>
            <Input
              id="plantingDate"
              type="date"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              className="input-agricultural mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="previousCrop" className="text-sm">Previous Crop</Label>
            <Input
              id="previousCrop"
              placeholder="What was grown before?"
              value={previousCrop}
              onChange={(e) => setPreviousCrop(e.target.value)}
              className="input-agricultural mt-1.5"
            />
          </div>
        </section>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-14 bg-gradient-primary text-lg font-semibold shadow-glow"
          disabled={analyzing}
        >
          {analyzing ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Leaf className="h-5 w-5 mr-2" />
              Analyze Crop
            </>
          )}
        </Button>

        {/* Disclaimer */}
        <p className="text-xs text-center text-muted-foreground">
          ⚠️ AI detection is expanding. Results may vary as we improve our dataset.
        </p>
      </form>

      <BottomNav />
    </div>
  );
}
