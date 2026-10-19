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

export interface MemberPaymentItem {
  id: string;
  amount: number;
  month: string;
  date: string;
  method: string;
  status: string;
}

export interface MemberAttendanceItem {
  id: string;
  date: string;
  time: string;
  method: string;
}

export interface MemberDetails {
  id: string;
  name: string;
  initials: string;
  memberCode: string;
  phone: string;
  email: string;
  membershipStatus: "ACTIVE" | "EXPIRED";
  startDate: string;
  expiryDate: string;
  rawStartDate: string;
  rawExpiryDate: string;
  monthlyFee: number;
  feeStatus: "PAID" | "DUE";
  lastPayment: {
    amount: number;
    month: string;
    date: string;
    method: string;
  } | null;
  attendanceCount: number;
  recentAttendances: MemberAttendanceItem[];
  payments: MemberPaymentItem[];
}

