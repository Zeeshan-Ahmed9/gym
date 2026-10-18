export type AttendanceMethodType = "QR Code" | "Manual";

export type DateFilterOption = "Today" | "Yesterday" | "This Week" | "This Month";

export type MethodFilterOption = "All" | "QR Code" | "Manual";

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberCode: string;
  initials: string;
  checkInTime: string;
  checkInDate: string;
  method: AttendanceMethodType;
  membershipTier?: string;
  membershipStatus: "Active" | "Expired" | "Pending";
  status: "Verified";
  dateCategory: DateFilterOption;
}

export interface AttendanceSummaryData {
  todayCount: number;
  monthCount: number;
  qrPercentage: number;
  manualPercentage: number;
}
