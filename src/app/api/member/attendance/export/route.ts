import { NextRequest, NextResponse } from "next/server";
import { getMemberAttendanceData } from "@/server/services/member-attendance.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month") || undefined;
    const sort = (searchParams.get("sort") as "newest" | "oldest") || "newest";

    const data = await getMemberAttendanceData({ month, sort });

    if (!data) {
      return new NextResponse("Unauthorized or member not found", { status: 401 });
    }

    const records = data.history.records;

    // Build CSV with proper headers and escaping
    const headers = ["Date", "Day", "Check-in Time", "Entry Method", "Status"];
    const rows = records.map((r) => [
      `"${r.dateFormatted.replace(/"/g, '""')}"`,
      `"${r.dayOfWeek.replace(/"/g, '""')}"`,
      `"${r.timeFormatted.replace(/"/g, '""')}"`,
      `"${r.methodLabel.replace(/"/g, '""')}"`,
      `"${r.status.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");

    const filename = `fitflow-attendance-${data.calendar.selectedMonth}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("CSV Export error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
