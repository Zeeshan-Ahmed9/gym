import type { MemberListItem, MemberStats } from "@/types/member";

/**
 * Service to fetch member roster and statistics.
 * Structured to cleanly separate UI from eventual database querying.
 */
export async function getMembersList(): Promise<MemberListItem[]> {
  return [
    {
      id: "mem-1",
      name: "Ahmed Khan",
      initials: "AK",
      memberCode: "GYM-48291",
      phone: "+92 300 4829102",
      membershipStatus: "ACTIVE",
      expiryDate: "24 Nov 2024",
      isExpiringSoon: true,
      monthlyFee: "Rs. 5,000",
      feeStatus: "PAID",
      lastCheckIn: "Today, 7:32 PM",
    },
    {
      id: "mem-2",
      name: "Ali Raza",
      initials: "AR",
      memberCode: "GYM-49221",
      phone: "+92 321 9928114",
      membershipStatus: "ACTIVE",
      expiryDate: "12 Dec 2024",
      isExpiringSoon: false,
      monthlyFee: "Rs. 6,500",
      feeStatus: "DUE",
      lastCheckIn: "Today, 7:35 PM",
    },
    {
      id: "mem-3",
      name: "Hamza Sheikh",
      initials: "HS",
      memberCode: "GYM-51231",
      phone: "+92 333 1184920",
      membershipStatus: "ACTIVE",
      expiryDate: "05 Jan 2025",
      isExpiringSoon: false,
      monthlyFee: "Rs. 5,000",
      feeStatus: "PAID",
      lastCheckIn: "Today, 7:41 PM",
    },
    {
      id: "mem-4",
      name: "Bilal Tariq",
      initials: "BT",
      memberCode: "GYM-50112",
      phone: "+92 345 7712399",
      membershipStatus: "EXPIRED",
      expiryDate: "18 Nov 2024",
      isExpiringSoon: false,
      monthlyFee: "Rs. 5,500",
      feeStatus: "DUE",
      lastCheckIn: "Today, 7:46 PM",
    },
    {
      id: "mem-5",
      name: "Usman Saeed",
      initials: "US",
      memberCode: "GYM-47890",
      phone: "+92 312 4001928",
      membershipStatus: "ACTIVE",
      expiryDate: "28 Dec 2024",
      isExpiringSoon: false,
      monthlyFee: "Rs. 8,000",
      feeStatus: "PAID",
      lastCheckIn: "Today, 7:50 PM",
    },
    {
      id: "mem-6",
      name: "Daniyal Farooq",
      initials: "DF",
      memberCode: "GYM-52319",
      phone: "+92 301 8847291",
      membershipStatus: "ACTIVE",
      expiryDate: "15 Jan 2025",
      isExpiringSoon: false,
      monthlyFee: "Rs. 5,000",
      feeStatus: "PAID",
      lastCheckIn: "Yesterday, 6:15 PM",
    },
  ];
}

export async function getMembersStats(): Promise<MemberStats> {
  return {
    totalStrength: 326,
    activePassports: 310,
    expiringOrExpired: 16,
    duesOutstanding: 14,
  };
}
