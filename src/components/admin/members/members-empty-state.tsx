"use client";

import * as React from "react";
import { Users, Plus, RefreshCw } from "lucide-react";

interface MembersEmptyStateProps {
  isFiltered?: boolean;
  onResetFilters?: () => void;
  onAddMemberClick?: () => void;
}

export function MembersEmptyState({
  isFiltered = false,
  onResetFilters,
  onAddMemberClick,
}: MembersEmptyStateProps) {
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground mb-3">
          <Users className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          No members found
        </h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          No members match your current search or filter criteria. Try adjusting your query or resetting filters.
        </p>
        {onResetFilters && (
          <div className="mt-5">
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-[#F5F8F6] transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pale-mint border border-primary/20 text-primary mb-3">
        <Users className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold text-foreground">
        No members yet
      </h3>
      <p className="mt-1 text-xs text-muted-foreground max-w-sm">
        Add your first member to get started.
      </p>
      <div className="mt-6">
        <button
          type="button"
          onClick={onAddMemberClick}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover active:scale-[0.98] transition-all duration-150 shadow-xs select-none cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Add Member</span>
        </button>
      </div>
    </div>
  );
}
