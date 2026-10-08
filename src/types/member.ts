export type MembershipStatusType = "ACTIVE" | "EXPIRED";
export type FeeStatusType = "PAID" | "DUE";

export interface MemberListItem {
  id: string;
  name: string;
  initials: string;
  memberCode: string;
  phone: string;
  membershipStatus: MembershipStatusType;
  expiryDate: string;
  isExpiringSoon?: boolean;
  monthlyFee: string;
  feeStatus: FeeStatusType;
  lastCheckIn: string;
}

export type StatusFilter = "ALL" | "ACTIVE" | "EXPIRED";
export type FeeFilter = "ALL" | "PAID" | "DUE";

export interface MemberStats {
  totalStrength: number;
  activePassports: number;
  expiringOrExpired: number;
  duesOutstanding: number;
}
