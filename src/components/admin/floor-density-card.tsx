import * as React from "react";
import { Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FloorDensityData } from "@/types/dashboard";

interface FloorDensityCardProps {
  data: FloorDensityData;
  className?: string;
}

export function FloorDensityCard({ data, className }: FloorDensityCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-xs",
        className
      )}
    >
      {/* Left: Icon & Description */}
      <div className="flex items-center gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
          <Radio className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground tracking-tight">
              Floor Density
            </h4>
            <span className="rounded-full bg-primary/20 border border-primary/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              {data.status}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {data.currentAthletes} Athletes currently checked into {data.zones}
          </p>
        </div>
      </div>

      {/* Right: Progress bar & Percentage */}
      <div className="flex w-full sm:w-auto items-center gap-3">
        <div className="relative h-2 w-full sm:w-44 md:w-56 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${data.percentage}%` }}
          />
        </div>
        <span className="shrink-0 text-xs font-bold text-muted-foreground">
          {data.percentage}% Max Cap
        </span>
      </div>
    </div>
  );
}
