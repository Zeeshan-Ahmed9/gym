export type UserRole = "ADMIN" | "MEMBER";

export type ActionResult<T = unknown> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never };

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export * from "./dashboard";
export * from "./member";
export * from "./attendance";
export type {
  FeeRecord,
  FeesSummaryData,
  StatusFilterOption,
  DemoMemberOption,
  PaymentMethodType,
} from "./fees";
export * from "./settings";
