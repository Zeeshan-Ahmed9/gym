"use server";

import { getMemberAttendanceData } from "@/server/services/member-attendance.service";
import type { MemberAttendanceData } from "@/types/member-attendance";
import type { ActionResult } from "@/types";

export async function fetchAttendanceDataAction(options?: {
  month?: string;
  sort?: "newest" | "oldest";
}): Promise<ActionResult<MemberAttendanceData>> {
  try {
    const data = await getMemberAttendanceData({
      month: options?.month,
      sort: options?.sort,
    });

    if (!data) {
      return { success: false, error: "Member profile not found." };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in fetchAttendanceDataAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load attendance data.",
    };
  }
}
