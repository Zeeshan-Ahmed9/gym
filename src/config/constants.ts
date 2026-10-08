export const ROLES = {
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
} as const;

export const MEMBERSHIP_STATUS = {
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
} as const;

export const PAYMENT_METHODS = {
  CASH: "CASH",
  BANK_TRANSFER: "BANK_TRANSFER",
  OTHER: "OTHER",
} as const;

export const PAYMENT_STATUS = {
  PAID: "PAID",
  PENDING: "PENDING",
  FAILED: "FAILED",
} as const;

export const ATTENDANCE_METHODS = {
  QR: "QR",
  MEMBER_CODE: "MEMBER_CODE",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ADMIN: {
    ROOT: "/admin",
    MEMBERS: "/admin/members",
    PAYMENTS: "/admin/payments",
    ATTENDANCE: "/admin/attendance",
  },
  MEMBER: {
    ROOT: "/member",
    PROFILE: "/member/profile",
    ATTENDANCE: "/member/attendance",
    PROGRESS: "/member/progress",
  },
} as const;
