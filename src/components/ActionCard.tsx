import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  to: string;
  icon: ReactNode;
  title: string;
  description: string;
  variant?: "primary" | "secondary" | "accent";
  badge?: string;
}

export function ActionCard({
  to,
  icon,
  title,
  description,
  variant = "primary",
  badge,
}: ActionCardProps) {
  const variants = {
    primary: "bg-gradient-primary text-primary-foreground",
    secondary: "bg-gradient-secondary text-secondary-foreground",
    accent: "bg-gradient-card border border-border text-foreground",
  };

  return (
    <Link
      to={to}
      className={cn(
        "action-card flex items-center gap-4 touch-target",
        variants[variant]
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl",
          variant === "accent"
            ? "bg-primary/10"
            : "bg-primary-foreground/15"
        )}
      >
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          {badge && (
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                variant === "accent"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary-foreground/20"
              )}
            >
              {badge}
            </span>
          )}
        </div>
        <p
          className={cn(
            "text-sm mt-0.5 line-clamp-1",
            variant === "accent" ? "text-muted-foreground" : "opacity-90"
          )}
        >
          {description}
        </p>
      </div>

      <ChevronRight
        className={cn(
          "flex-shrink-0 w-5 h-5",
          variant === "accent" ? "text-muted-foreground" : "opacity-70"
        )}
      />
    </Link>
  );
}
