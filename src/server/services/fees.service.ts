import type {
  FeeRecord,
  FeesSummaryData,
  DemoMemberOption,
} from "@/types/fees";

/**
 * Service to fetch admin fees summary metrics, fee records, and demo members.
 * Structured cleanly to allow direct replacement with Prisma queries when live database is queried.
 */
export async function getFeesSummary(): Promise<FeesSummaryData> {
  return {
    collectedMonth: 486000,
    collectedCount: 162,
    pendingDues: 84500,
    dueSoonCount: 9,
    overdueCount: 5,
    totalExpected: 570500,
    targetAmount: 620000,
    realizationRate: 92,
  };
}

export async function getDemoMembers(): Promise<DemoMemberOption[]> {
  return [
    {
      id: "mem-1",
      name: "Ahmed Khan",
      code: "GYM-48291",
      tier: "General Fitness Tier",
      defaultAmount: 3000,
    },
    {
      id: "mem-2",
      name: "Ali Raza",
      code: "GYM-49221",
      tier: "Standard Monthly",
      defaultAmount: 3000,
    },
    {
      id: "mem-3",
      name: "Bilal Tariq",
      code: "GYM-50112",
      tier: "CrossFit Unlimited",
      defaultAmount: 3000,
    },
    {
      id: "mem-4",
      name: "Hamza Sheikh",
      code: "GYM-51231",
      tier: "General Fitness Tier",
      defaultAmount: 3000,
    },
    {
      id: "mem-5",
      name: "Usman Saeed",
      code: "GYM-47890",
      tier: "VIP Trainer Package",
      defaultAmount: 5000,
    },
    {
      id: "mem-6",
      name: "Daniyal Farooq",
      code: "GYM-52319",
      tier: "Strength Tier",
      defaultAmount: 4000,
    },
    {
      id: "mem-7",
      name: "Zainab Malik",
      code: "GYM-46102",
      tier: "Annual Pro Tier",
      defaultAmount: 4500,
    },
  ];
}

export async function getFeeRecords(): Promise<FeeRecord[]> {
  return [
    {
      id: "fee-1",
      memberId: "mem-1",
      memberName: "Ahmed Khan",
      memberCode: "GYM-48291",
      initials: "AK",
      tier: "General Fitness Tier",
      amount: 3000,
      month: "November 2024",
      paymentDate: "24 Oct 2024",
      method: "Cash",
      status: "Paid",
    },
    {
      id: "fee-2",
      memberId: "mem-2",
      memberName: "Ali Raza",
      memberCode: "GYM-49221",
      initials: "AR",
      tier: "Standard Monthly",
      amount: 3000,
      month: "November 2024",
      paymentDate: null,
      method: null,
      status: "Due",
    },
    {
      id: "fee-3",
      memberId: "mem-3",
      memberName: "Bilal Tariq",
      memberCode: "GYM-50112",
      initials: "BT",
      tier: "CrossFit Unlimited",
      amount: 3000,
      month: "September 2024",
      paymentDate: null,
      method: null,
      status: "Overdue",
    },
    {
      id: "fee-4",
      memberId: "mem-4",
      memberName: "Hamza Sheikh",
      memberCode: "GYM-51231",
      initials: "HS",
      tier: "General Fitness Tier",
      amount: 3000,
      month: "November 2024",
      paymentDate: "05 Nov 2024",
      method: "Bank Transfer",
      status: "Paid",
    },
    {
      id: "fee-5",
      memberId: "mem-5",
      memberName: "Usman Saeed",
      memberCode: "GYM-47890",
      initials: "US",
      tier: "VIP Trainer Package",
      amount: 5000,
      month: "November 2024",
      paymentDate: "01 Nov 2024",
      method: "Cash",
      status: "Paid",
    },
    {
      id: "fee-6",
      memberId: "mem-6",
      memberName: "Daniyal Farooq",
      memberCode: "GYM-52319",
      initials: "DF",
      tier: "Strength Tier",
      amount: 4000,
      month: "October 2024",
      paymentDate: "28 Sep 2024",
      method: "Bank Transfer",
      status: "Paid",
    },
    {
      id: "fee-7",
      memberId: "mem-7",
      memberName: "Zainab Malik",
      memberCode: "GYM-46102",
      initials: "ZM",
      tier: "Annual Pro Tier",
      amount: 4500,
      month: "November 2024",
      paymentDate: null,
      method: null,
      status: "Due",
    },
  ];
}
