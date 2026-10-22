export interface MemberInfo {
  id: string;
  name: string;
  firstName: string;
  initials: string;
  memberCode: string;
  phone: string;
  email: string;
  avatarUrl?: string | null;
}

export interface MembershipDetails {
  status: "ACTIVE" | "EXPIRED" | "PENDING";
  planName: string;
  monthlyFee: number;
  billingPeriod: string; // e.g. "/mo"
  expiryDate: string; // e.g. "28 Oct 2026"
  validTillFormatted: string; // e.g. "Valid till 28 Oct 2026"
  isExpired: boolean;
  renewsFormatted: string; // e.g. "Renews 24 Nov"
  feeStatus: "PAID" | "DUE";
  duesAmount: number;
}

export interface WeekdayStatus {
  dayLetter: string; // M, T, W, T, F, S, S
  dayName: string; // Mon, Tue, etc.
  dateStr: string; // YYYY-MM-DD
  attended: boolean;
  isToday: boolean;
}

export interface AttendanceStats {
  visitsThisMonth: number;
  monthlyGoal: number;
  goalPercentage: number;
  currentStreak: number;
  streakMessage: string;
  weekDays: WeekdayStatus[];
  checkedInToday: boolean;
  todayCheckInTime?: string;
  todayGate?: string;
}

export interface BodyMetricsData {
  currentWeight: number | null;
  startingWeight: number | null;
  targetWeight: number | null;
  weightChange: number | null; // e.g. -4.0
  weightChangeFormatted: string | null; // e.g. "-4.0 kg" or "+1.2 kg"
  trendPoints: number[]; // Array of weight values for sparkline
  hasMetrics: boolean;
}

export interface FloorOccupancyData {
  percentage: number;
  statusText: string;
  closingTime: string;
}

export interface MemberDashboardData {
  member: MemberInfo;
  membership: MembershipDetails;
  attendance: AttendanceStats;
  bodyMetrics: BodyMetricsData;
  occupancy: FloorOccupancyData;
}
