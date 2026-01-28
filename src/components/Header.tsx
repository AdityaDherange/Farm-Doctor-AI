import { Leaf } from "lucide-react";
import { OnlineBanner } from "./OnlineBanner";

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
}

export function Header({ title = "CropGuard AI", showLogo = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 safe-area-top bg-card/95 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showLogo && (
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
          <div>
            <h1 className="font-bold text-lg text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground">Protect your crops</p>
          </div>
        </div>
        <OnlineBanner />
      </div>
    </header>
  );
}
