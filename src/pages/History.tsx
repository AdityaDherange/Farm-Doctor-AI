import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CROPS, SEVERITY_LEVELS } from "@/lib/crops";
import { formatDistanceToNow } from "date-fns";
import { Leaf, ChevronRight, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiagnosisItem {
  id: string;
  crop: string;
  disease: string;
  severity: string;
  confidence: number;
  image_url: string | null;
  created_at: string;
}

export default function History() {
  const { user } = useAuth();
  const [diagnoses, setDiagnoses] = useState<DiagnosisItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!user) return;

      const { data, error } = await supabase
        .from("diagnoses")
        .select("id, crop, disease, severity, confidence, image_url, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) {
        setDiagnoses(data);
      }
      setLoading(false);
    }

    fetchHistory();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header title="History" />
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Leaf className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Sign in to view history</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Your past diagnoses will appear here
          </p>
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Diagnosis History" />

      <main className="px-4 py-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="card-agricultural p-4 animate-pulse h-24"
              />
            ))}
          </div>
        ) : diagnoses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Leaf className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">No diagnoses yet</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Start by scanning your first crop
            </p>
            <Link
              to="/detect"
              className="text-primary font-medium hover:underline"
            >
              Detect Disease
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {diagnoses.map((item) => {
              const cropInfo = CROPS.find((c) => c.id === item.crop);
              const severityInfo = SEVERITY_LEVELS.find(
                (s) => s.id === item.severity
              );
              const isHealthy = item.severity === "healthy";

              return (
                <Link
                  key={item.id}
                  to={`/result/${item.id}`}
                  className="card-agricultural p-4 flex items-center gap-4 hover:shadow-lg transition-shadow"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.crop}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl">{cropInfo?.icon}</span>
                      </div>
                    )}
                    {/* Severity indicator */}
                    <div
                      className={cn(
                        "absolute bottom-1 right-1 w-5 h-5 rounded-full flex items-center justify-center",
                        isHealthy ? "bg-success" : "bg-destructive"
                      )}
                    >
                      {isHealthy ? (
                        <CheckCircle className="h-3 w-3 text-primary-foreground" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground truncate">
                        {cropInfo?.name || item.crop}
                      </h3>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          isHealthy
                            ? "bg-success/15 text-success"
                            : "bg-destructive/15 text-destructive"
                        )}
                      >
                        {severityInfo?.label || item.severity}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                      {item.disease}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(item.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>

                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
