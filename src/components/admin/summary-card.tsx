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
        return "bg-pale-mint border border-primary/25";
      case "members":
        return "bg-secondary border border-border";
      case "active":
        return "bg-[#E5F6EF] border border-success/25";
      case "fees":
        return "bg-[#FDF2F2] border border-danger/25";
    }
  };

  const renderBadge = () => {
    if (metric.iconName === "attendance") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F6EF] border border-success/25 px-2.5 py-0.5 text-xs font-semibold text-success">
          <TrendingUp className="h-3 w-3" />
          {metric.trendText}
        </span>
      );
    }

    if (metric.iconName === "active") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F6EF] border border-success/25 px-2.5 py-0.5 text-xs font-semibold text-success">
          <Check className="h-3 w-3" />
          {metric.trendText}
        </span>
      );
    }

    if (metric.iconName === "fees") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#FDF2F2] border border-danger/25 px-2.5 py-0.5 text-xs font-semibold text-danger">
          <AlertCircle className="h-3 w-3" />
          {metric.trendText}
        </span>
      );
    }

    // Default for total members
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
        {metric.trendText || "All Active"}
      </span>
    );
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-xs transition-all duration-200 hover:border-[#BAC8BF]",
        className
      )}
    >
      {/* Top: Title & Icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">
          {metric.title}
        </span>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl",
            getIconWrapperClass()
          )}
        >
          {getIcon()}
        </div>
      </div>

      {/* Value */}
      <div className="mt-3">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {metric.value}
        </span>
      </div>

      {/* Bottom Information Row */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
        {renderBadge()}

        {/* Secondary Info */}
        <span className="text-xs text-muted-foreground truncate">
          {metric.extraInfo}
        </span>
      </div>
    </div>
  );
}
