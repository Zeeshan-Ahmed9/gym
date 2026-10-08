import * as React from "react";
import Link from "next/link";
import { Users, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MembersEmptyStateProps {
  isFiltered?: boolean;
  onResetFilters?: () => void;
}

export function MembersEmptyState({
  isFiltered = false,
  onResetFilters,
}: MembersEmptyStateProps) {
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-[#15191D]/60 p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary border border-border text-muted-foreground shadow-sm">
          <Users className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-bold text-foreground">
          No members found
        </h3>
        <p className="mt-1.5 max-w-sm text-xs text-muted-foreground leading-relaxed">
          No members match your current search or filter criteria. Try adjusting your query or resetting filters.
        </p>
        {onResetFilters && (
          <div className="mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-[#15191D]/60 p-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary border border-border text-primary shadow-sm">
        <Users className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-foreground">
        No members yet
      </h3>
      <p className="mt-1.5 max-w-sm text-xs text-muted-foreground leading-relaxed">
        Add your first member to start tracking attendance and membership.
      </p>
      <div className="mt-6">
        <Link
          href="/admin/members/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-extrabold text-[#0B0D0F] hover:bg-primary-hover active:scale-[0.98] transition-all duration-150 shadow-sm shadow-primary/10 select-none cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Add Member</span>
        </Link>
      </div>
    </div>
  );
}
