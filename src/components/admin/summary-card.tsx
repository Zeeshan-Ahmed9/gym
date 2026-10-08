import * as React from "react";
import {
  Users,
  UserCheck,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SummaryMetric } from "@/types/dashboard";

interface SummaryCardProps {
  metric: SummaryMetric;
  className?: string;
}

export function SummaryCard({ metric, className }: SummaryCardProps) {
  const getIcon = () => {
    switch (metric.iconName) {
      case "attendance":
        return <UserCheck className="h-4 w-4 text-primary" />;
      case "members":
        return <Users className="h-4 w-4 text-foreground" />;
      case "active":
        return <ShieldCheck className="h-4 w-4 text-success" />;
      case "fees":
        return <CreditCard className="h-4 w-4 text-danger" />;
    }
  };

  const getIconWrapperClass = () => {
    switch (metric.iconName) {
      case "attendance":
        return "bg-primary/15 border border-primary/20";
      case "members":
        return "bg-secondary border border-border";
      case "active":
        return "bg-success/15 border border-success/20";
      case "fees":
        return "bg-danger/15 border border-danger/20";
    }
  };

  const renderBadge = () => {
    if (metric.iconName === "attendance") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-success/15 border border-success/30 px-2 py-0.5 text-[11px] font-bold text-success">
          <TrendingUp className="h-3 w-3" />
          {metric.trendText}
        </span>
      );
    }

    if (metric.iconName === "active") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-success/15 border border-success/30 px-2 py-0.5 text-[11px] font-bold text-success">
          <Check className="h-3 w-3" />
          {metric.trendText}
        </span>
      );
    }

    if (metric.iconName === "fees") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-danger/15 border border-danger/30 px-2 py-0.5 text-[11px] font-bold text-danger">
          <AlertCircle className="h-3 w-3" />
          {metric.trendText}
        </span>
      );
    }

    // Default for total members
    return (
      <span className="text-xs text-muted-foreground font-medium">
        {metric.extraInfo || "Roster Capacity: 72%"}
      </span>
    );
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-[#15191D] p-5 shadow-sm transition-all duration-200 hover:border-border/80 hover:shadow-md",
        className
      )}
    >
      {/* Top: Title & Icon */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">
          {metric.title}
        </span>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl",
            getIconWrapperClass()
          )}
        >
          {getIcon()}
        </div>
      </div>

      {/* Value */}
      <div className="mt-3">
        <span className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {metric.value}
        </span>
      </div>

      {/* Bottom Information Row */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/40 pt-3">
        {renderBadge()}

        {/* Secondary Info */}
        <span className="text-xs text-muted-foreground truncate">
          {metric.iconName === "members"
            ? metric.trendText
            : metric.extraInfo}
        </span>
      </div>
    </div>
  );
}
