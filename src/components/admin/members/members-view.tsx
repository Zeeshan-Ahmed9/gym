"use client";

import * as React from "react";
import type { MemberListItem, StatusFilter, FeeFilter, MemberDetails } from "@/types/member";
import { MembersToolbar } from "./members-toolbar";
import { MembersTable } from "./members-table";
import { MembersMobileList } from "./members-mobile-list";
import { MembersEmptyState } from "./members-empty-state";
import { AddMemberModal } from "./add-member-modal";
import { MemberDetailsModal } from "./member-details-modal";
import { EditMemberModal, type EditMemberData } from "./edit-member-modal";
import { DeleteMemberModal, type DeleteMemberData } from "./delete-member-modal";
import { Plus, CheckCircle2, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface MembersViewProps {
  initialMembers: MemberListItem[];
  defaultMonthlyFee?: number;
  defaultDurationMonths?: number;
}

export function MembersView({
  initialMembers,
  defaultMonthlyFee = 3000,
  defaultDurationMonths = 1,
}: MembersViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search and filter state
  const urlSearch = searchParams.get("search") || "";
  const [prevUrlSearch, setPrevUrlSearch] = React.useState(urlSearch);
  const [searchQuery, setSearchQuery] = React.useState(urlSearch);

  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setSearchQuery(urlSearch);
  }

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("ALL");
  const [feeFilter, setFeeFilter] = React.useState<FeeFilter>("ALL");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [viewMemberId, setViewMemberId] = React.useState<string | null>(null);
  const [editMember, setEditMember] = React.useState<EditMemberData | null>(null);
  const [deleteMember, setDeleteMember] = React.useState<DeleteMemberData | null>(null);

  // Success toast
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4500);
  };

  const handleEditMember = (m: MemberListItem | EditMemberData | MemberDetails) => {
    if ("monthlyFee" in m && typeof m.monthlyFee === "string") {
      const numericFee = Number(m.monthlyFee.replace(/[^0-9]/g, "")) || undefined;
      setEditMember({
        id: m.id,
        name: m.name,
        phone: m.phone,
        monthlyFee: numericFee,
        membershipStatus: m.membershipStatus,
      });
    } else {
      setEditMember(m as EditMemberData);
    }
  };

  const handleDeleteMember = (m: MemberListItem | DeleteMemberData | MemberDetails) => {
    setDeleteMember({
      id: m.id,
      name: m.name,
      memberCode: m.memberCode,
      phone: m.phone,
    });
  };

  // Live counts for filters
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

  return (
    <div className="space-y-4">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-accent border border-primary/25 px-4 py-3 text-sm text-success animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="rounded-lg p-1 text-success/80 hover:text-success cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header with primary + Add Member button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Members
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your gym members, attendance history, and fee status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover active:scale-[0.98] transition-all duration-150 shadow-xs select-none cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Add Member</span>
        </button>
      </div>

      {initialMembers.length === 0 ? (
        <MembersEmptyState onAddMemberClick={() => setIsAddModalOpen(true)} />
      ) : (
        <>
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

          {/* Content */}
          {filteredMembers.length === 0 ? (
            <MembersEmptyState
              isFiltered={isFiltered}
              onResetFilters={handleResetFilters}
              onAddMemberClick={() => setIsAddModalOpen(true)}
            />
          ) : (
            <>
              {/* Desktop Table View */}
              <MembersTable
                members={filteredMembers}
                onViewMember={(id) => setViewMemberId(id)}
                onEditMember={handleEditMember}
                onDeleteMember={handleDeleteMember}
              />

              {/* Mobile Stacked Card View */}
              <MembersMobileList
                members={filteredMembers}
                onViewMember={(id) => setViewMemberId(id)}
                onEditMember={handleEditMember}
                onDeleteMember={handleDeleteMember}
              />

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
        </>
      )}

      {/* 1. Add Member Modal */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultMonthlyFee={defaultMonthlyFee}
        defaultDurationMonths={defaultDurationMonths}
        onSuccess={(created) => {
          showToast(`Member "${created.name}" created with code ${created.memberCode}!`);
          router.refresh();
        }}
      />

      {/* 2. Member Details Profile Modal */}
      <MemberDetailsModal
        memberId={viewMemberId}
        isOpen={Boolean(viewMemberId)}
        onClose={() => setViewMemberId(null)}
        onEditClick={(details) => {
          setViewMemberId(null);
          handleEditMember(details);
        }}
        onDeleteClick={(details) => {
          setViewMemberId(null);
          handleDeleteMember(details);
        }}
      />

      {/* 3. Edit Member Modal */}
      <EditMemberModal
        member={editMember}
        isOpen={Boolean(editMember)}
        onClose={() => setEditMember(null)}
        onSuccess={() => {
          showToast("Member updated successfully.");
          router.refresh();
        }}
      />

      {/* 4. Delete Member Modal */}
      <DeleteMemberModal
        member={deleteMember}
        isOpen={Boolean(deleteMember)}
        onClose={() => setDeleteMember(null)}
        onSuccess={() => {
          showToast("Member removed successfully.");
          router.refresh();
        }}
      />
    </div>
  );
}
