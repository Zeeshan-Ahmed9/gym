export interface GymSettings {
  gymName: string;
  gymLogo: string | null;
  phone: string;
  email: string;
  address: string;
  defaultMonthlyFee: number;
  defaultMembershipDurationMonths: number;
}

export interface GymSettingsFormErrors {
  gymName?: string;
  phone?: string;
  email?: string;
  defaultMonthlyFee?: string;
  defaultMembershipDurationMonths?: string;
}
