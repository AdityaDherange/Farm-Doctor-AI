import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CROPS, SEVERITY_LEVELS } from "@/lib/crops";
import {
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  Droplets,
  Leaf,
  Beaker,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Diagnosis {
  id: string;
  crop: string;
  variety: string | null;
  disease: string;
  severity: string;
  confidence: number;
  image_url: string | null;
  explanation: string | null;
  treatment_chemical: string | null;
  treatment_organic: string | null;
  created_at: string;
}

export default function Result() {
  const { id } = useParams();
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDiagnosis() {
      if (!id) return;

      const { data, error } = await supabase
        .from("diagnoses")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        setDiagnosis(data);
      }
      setLoading(false);
    }

    fetchDiagnosis();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header title="Result" />
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <p className="text-muted-foreground">Diagnosis not found</p>
          <Link to="/history" className="text-primary mt-2">
            View History
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  const cropInfo = CROPS.find((c) => c.id === diagnosis.crop);
  const severityInfo = SEVERITY_LEVELS.find((s) => s.id === diagnosis.severity);
  const isHealthy = diagnosis.severity === "healthy";
  const confidencePercent = Math.round(diagnosis.confidence * 100);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Analysis Result" />

      <main className="px-4 py-6 space-y-6">
        {/* Back button */}
        <Link
          to="/history"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to History</span>
        </Link>

        {/* Image & Status */}
        <div className="relative overflow-hidden rounded-2xl">
          {diagnosis.image_url ? (
            <img
              src={diagnosis.image_url}
              alt="Crop"
              className="w-full h-56 object-cover"
            />
          ) : (
            <div className="w-full h-56 bg-muted flex items-center justify-center">
              <Leaf className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <div
              className={cn(
                "status-indicator",
                isHealthy ? "bg-success/90" : "bg-destructive/90",
                "text-primary-foreground"
              )}
            >
              {isHealthy ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <span>{severityInfo?.label || diagnosis.severity}</span>
            </div>
          </div>

          {/* Crop Info */}
          <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{cropInfo?.icon}</span>
              <h2 className="text-xl font-bold">
                {cropInfo?.name || diagnosis.crop}
              </h2>
            </div>
            {diagnosis.variety && (
              <p className="text-sm opacity-80">Variety: {diagnosis.variety}</p>
            )}
          </div>
        </div>

        {/* Disease Info Card */}
        <div className="card-agricultural p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Detected Condition
              </p>
              <h3 className="text-xl font-bold text-foreground mt-1">
                {diagnosis.disease}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Confidence</p>
              <p className="text-2xl font-bold text-primary">
                {confidencePercent}%
              </p>
            </div>
          </div>

          {/* Confidence Bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isHealthy ? "bg-success" : "bg-primary"
              )}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>

          {diagnosis.explanation && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {diagnosis.explanation}
            </p>
          )}
        </div>

        {/* Treatment Cards */}
        {!isHealthy && (
          <section className="space-y-3">
            <h3 className="font-semibold text-foreground">
              Recommended Treatment
            </h3>

            {diagnosis.treatment_organic && (
              <div className="card-agricultural p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Organic Treatment
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {diagnosis.treatment_organic}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {diagnosis.treatment_chemical && (
              <div className="card-agricultural p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center flex-shrink-0">
                    <Beaker className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Chemical Treatment
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {diagnosis.treatment_chemical}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Prevention Tips */}
        <section className="card-agricultural p-4">
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Droplets className="h-4 w-4 text-primary" />
            Prevention Tips
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Ensure proper plant spacing for air circulation
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Water at the base of plants, not on leaves
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Remove and destroy infected plant material
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Rotate crops each season
            </li>
          </ul>
        </section>

        {/* Actions */}
        <div className="flex gap-3">
          <Link to={`/chat?diagnosis=${diagnosis.id}`} className="flex-1">
            <Button className="w-full bg-gradient-primary">
              <MessageCircle className="h-4 w-4 mr-2" />
              Ask AI Doctor
            </Button>
          </Link>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
