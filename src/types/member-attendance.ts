export interface CalendarDayRecord {
  id: string;
  checkInTime: string; // ISO string
  timeFormatted: string; // e.g. "7:32 PM"
  method: "QR" | "MEMBER_CODE";
  methodLabel: string; // "QR Gate Check-in" | "Front Desk Manual"
  status: "Verified";
}

export interface CalendarDay {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  dayOfWeek: number; // 0-6 (0 = Mon, 6 = Sun)
  isCurrentMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
  hasAttendance: boolean;
  records: CalendarDayRecord[];
}

export interface TimeDistributionBucket {
  label: "Morning" | "Afternoon" | "Evening Peak" | "Night";
  count: number;
  percentage: number;
  isPeak: boolean;
}

export interface AttendanceHistoryItem {
  id: string;
  checkInTime: string;
  dateFormatted: string; // e.g. "Oct 1"
  dayOfWeek: string; // e.g. "Tuesday"
  timeFormatted: string; // e.g. "7:32 PM"
  method: "QR" | "MEMBER_CODE";
  methodLabel: string; // "QR Gate Check-in" | "Front Desk Manual"
  status: "Verified";
}

export interface MemberAttendanceSummary {
  thisMonthVisits: number;
  monthlyTarget: number;
  goalPercentage: number;
  currentStreak: number;
  bestStreak: number;
  allTimeVisits: number;
  membershipTier: string;
  regularBadge: string;
}

export interface MemberAttendanceData {
  member: {
    id: string;
    name: string;
    firstName: string;
    initials: string;
    memberCode: string;
    phone: string;
    email: string;
  };
  membership: {
    status: "ACTIVE" | "EXPIRED" | "PENDING";
    planName: string;
    monthlyFee: number;
    billingPeriod: string;
    expiryDate: string;
    isExpired: boolean;
  };
  gymName: string;
  summary: MemberAttendanceSummary;
  calendar: {
    selectedMonth: string; // YYYY-MM
    selectedMonthLabel: string; // e.g. "October 2026"
    previousMonth: string;
    nextMonth: string;
    days: CalendarDay[];
    consistencyScore: number;
    comparisonText: string | null; // e.g. "+4% vs Sep"
  };
  preferredWindow: {
    peakTimeLabel: string; // e.g. "6:45 PM – 7:35 PM"
    hasData: boolean;
    distribution: TimeDistributionBucket[];
  };
  history: {
    records: AttendanceHistoryItem[];
    totalInMonth: number;
    totalAllTime: number;
  };
}
