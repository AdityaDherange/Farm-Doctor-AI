import { ScanLine, MessageCircle, History, CloudSun, Leaf, Sprout } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ActionCard } from "@/components/ActionCard";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Weather from "@/components/Weather";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background pattern-leaves pb-24">
      <Header />

      <main className="px-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-6 text-primary-foreground">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="h-5 w-5" />
              <span className="text-sm font-medium opacity-90">AI-Powered</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Protect Your Crops Today
            </h2>
            <p className="text-sm opacity-90 mb-4 max-w-xs">
              Detect diseases early with AI. Get treatment recommendations tailored to your farm.
            </p>
            {!user ? (
              <Link to="/login">
                <Button variant="secondary" className="shadow-gold font-semibold">
                  Get Started Free
                </Button>
              </Link>
            ) : (
              <Link to="/detect">
                <Button variant="secondary" className="shadow-gold font-semibold">
                  <ScanLine className="h-4 w-4 mr-2" />
                  Start Detection
                </Button>
              </Link>
            )}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-primary-foreground/10 rounded-full" />
          <div className="absolute -right-4 top-4 w-20 h-20 bg-primary-foreground/10 rounded-full" />
          <Sprout className="absolute right-6 bottom-6 h-16 w-16 text-primary-foreground/20" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card-agricultural p-4 text-center">
            <div className="text-2xl font-bold text-primary">38+</div>
            <div className="text-xs text-muted-foreground">Diseases</div>
          </div>
          <div className="card-agricultural p-4 text-center">
            <div className="text-2xl font-bold text-primary">14</div>
            <div className="text-xs text-muted-foreground">Crops</div>
          </div>
          <div className="card-agricultural p-4 text-center">
            <div className="text-2xl font-bold text-primary">95%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
        </div>

        {/* Weather */}
        <Weather />

        {/* Main Actions */}
        <section className="space-y-4">
          <h3 className="font-semibold text-foreground">Quick Actions</h3>
          
          <ActionCard
            to="/detect"
            icon={<ScanLine className="h-7 w-7" />}
            title="Detect Disease"
            description="Scan your crop for instant AI diagnosis"
            variant="primary"
          />

          <ActionCard
            to="/chat"
            icon={<MessageCircle className="h-7 w-7" />}
            title="Krushi Doctor"
            description="Ask our AI farming assistant anything"
            variant="secondary"
            badge="AI"
          />

          <ActionCard
            to="/history"
            icon={<History className="h-7 w-7" />}
            title="Diagnosis History"
            description="View your previous crop analyses"
            variant="accent"
          />

          <ActionCard
            to="/weather"
            icon={<CloudSun className="h-7 w-7" />}
            title="Weather & Alerts"
            description="Local weather and disease risk alerts"
            variant="accent"
            badge="Coming Soon"
          />
        </section>

        {/* Info Banner */}
        <div className="card-agricultural p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-warning/15 flex items-center justify-center flex-shrink-0">
              <Leaf className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Works Offline Too!
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Crop detection works even without internet. Results sync when you're back online.
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
