"use client";

import * as React from "react";
import type { MemberListItem, StatusFilter, FeeFilter } from "@/types/member";
import { MembersToolbar } from "./members-toolbar";
import { MembersTable } from "./members-table";
import { MembersMobileList } from "./members-mobile-list";
import { MembersEmptyState } from "./members-empty-state";

interface MembersViewProps {
  initialMembers: MemberListItem[];
}

export function MembersView({ initialMembers }: MembersViewProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("ALL");
  const [feeFilter, setFeeFilter] = React.useState<FeeFilter>("ALL");

  // Calculate live counts for filter pills from initial dataset
  const counts = React.useMemo(() => {
    return {
      all: initialMembers.length,
      active: initialMembers.filter((m) => m.membershipStatus === "ACTIVE").length,
      expired: initialMembers.filter((m) => m.membershipStatus === "EXPIRED").length,
      feeDue: initialMembers.filter((m) => m.feeStatus === "DUE").length,
    };
  }, [initialMembers]);

  // Filter members based on search and selected filters
  const filteredMembers = React.useMemo(() => {
    return initialMembers.filter((member) => {
      // 1. Text Search: name, member code, or phone
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = member.name.toLowerCase().includes(query);
        const matchesCode = member.memberCode.toLowerCase().includes(query);
        const matchesPhone = member.phone.replace(/\s+/g, "").includes(query.replace(/\s+/g, ""));

        if (!matchesName && !matchesCode && !matchesPhone) {
          return false;
        }
      }

      // 2. Status filter
      if (statusFilter !== "ALL") {
        if (member.membershipStatus !== statusFilter) {
          return false;
        }
      }

      // 3. Fee filter
      if (feeFilter !== "ALL") {
        if (member.feeStatus !== feeFilter) {
          return false;
        }
      }

      return true;
    });
  }, [initialMembers, searchQuery, statusFilter, feeFilter]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setFeeFilter("ALL");
  };

  const isFiltered =
    Boolean(searchQuery.trim()) || statusFilter !== "ALL" || feeFilter !== "ALL";

  if (initialMembers.length === 0) {
    return <MembersEmptyState />;
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters Toolbar */}
      <MembersToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        feeFilter={feeFilter}
        onFeeFilterChange={setFeeFilter}
        counts={counts}
      />

      {/* Content: Table on Desktop, Cards on Mobile, or Empty Filtered State */}
      {filteredMembers.length === 0 ? (
        <MembersEmptyState
          isFiltered={isFiltered}
          onResetFilters={handleResetFilters}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <MembersTable members={filteredMembers} />

          {/* Mobile Stacked Card View */}
          <MembersMobileList members={filteredMembers} />

          {/* Members Count Footer */}
          <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{filteredMembers.length}</strong> of{" "}
              <strong className="text-foreground">{initialMembers.length}</strong> registered members
            </span>
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-primary hover:underline font-semibold cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
