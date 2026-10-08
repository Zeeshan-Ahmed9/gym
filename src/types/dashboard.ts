export interface SummaryMetric {
  title: string;
  value: string | number;
  subValue?: string;
  trendText: string;
  trendPositive?: boolean;
  extraInfo?: string;
  iconName: "attendance" | "members" | "active" | "fees";
  badgeVariant?: "success" | "warning" | "danger" | "primary" | "muted";
}

export type CheckInMethod = "QR CODE" | "MANUAL";

export interface CheckInItem {
  id: string;
  name: string;
  initials: string;
  memberCode: string;
  tier: string;
  method: CheckInMethod;
  time: string;
}

export interface ExpiringMembershipItem {
  id: string;
  name: string;
  initials: string;
  plan: string;
  daysRemaining: number;
  expiryDate: string;
  urgency: "urgent" | "warning";
}

export interface FloorDensityData {
  currentAthletes: number;
  zones: string;
  percentage: number;
  status: string;
}

export interface DashboardData {
  metrics: {
    attendance: SummaryMetric;
    totalMembers: SummaryMetric;
    activeMembers: SummaryMetric;
    feesDue: SummaryMetric;
  };
  floorDensity: FloorDensityData;
  recentCheckIns: CheckInItem[];
  expiringMemberships: ExpiringMembershipItem[];
}
