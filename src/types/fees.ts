export type PaymentMethodType = "Cash" | "Bank Transfer" | "Other";

export type FeeStatusType = "Paid" | "Due" | "Overdue";

export interface FeeRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberCode: string;
  initials: string;
  tier: string;
  amount: number;
  month: string;
  paymentDate: string | null;
  method: PaymentMethodType | null;
  status: FeeStatusType;
}

export interface FeesSummaryData {
  collectedMonth: number;
  collectedCount: number;
  pendingDues: number;
  dueSoonCount: number;
  overdueCount: number;
  totalExpected: number;
  targetAmount: number;
  realizationRate: number;
}

export type StatusFilterOption = "All" | "Paid" | "Due" | "Overdue";

export interface DemoMemberOption {
  id: string;
  name: string;
  code: string;
  tier: string;
  defaultAmount: number;
}
