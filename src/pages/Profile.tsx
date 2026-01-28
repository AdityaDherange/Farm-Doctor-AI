import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, HelpCircle, Shield, Leaf, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header title="Profile" />
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mb-6 shadow-glow">
            <Leaf className="h-10 w-10 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Join CropGuard AI</h2>
          <p className="text-muted-foreground mt-2 mb-6 max-w-xs">
            Create an account to save your diagnoses and get personalized recommendations
          </p>
          <div className="flex gap-3">
            <Link to="/signup">
              <Button className="bg-gradient-primary">Create Account</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Profile" />

      <main className="px-4 py-6 space-y-6">
        {/* User Info */}
        <div className="card-agricultural p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <Leaf className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg text-foreground truncate">
              {user.email?.split("@")[0] || "Farmer"}
            </h2>
            <p className="text-sm text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card-agricultural p-4 text-center">
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">Diagnoses</div>
          </div>
          <div className="card-agricultural p-4 text-center">
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">Crops Saved</div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          <button className="w-full card-agricultural p-4 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-foreground">Location Settings</div>
              <div className="text-sm text-muted-foreground">Update your farm location</div>
            </div>
          </button>

          <button className="w-full card-agricultural p-4 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-foreground">App Settings</div>
              <div className="text-sm text-muted-foreground">Notifications, language</div>
            </div>
          </button>

          <button className="w-full card-agricultural p-4 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-foreground">Help & Support</div>
              <div className="text-sm text-muted-foreground">FAQs, contact us</div>
            </div>
          </button>

          <button className="w-full card-agricultural p-4 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-foreground">Privacy & Security</div>
              <div className="text-sm text-muted-foreground">Data and permissions</div>
            </div>
          </button>
        </div>

        {/* Sign Out */}
        <Button
          variant="outline"
          className="w-full h-12 border-destructive/30 text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground">
          CropGuard AI v1.0.0 • Made with 🌱 for Farmers
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
