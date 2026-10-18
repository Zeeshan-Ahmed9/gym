import { AttendanceView } from "@/components/admin";
import {
  getAttendanceSummary,
  getAttendanceRecords,
} from "@/server/services/attendance.service";

export const metadata = {
  title: "Attendance Log",
  description: "View and manage daily member check-ins.",
};

export default async function AdminAttendancePage() {
  const [summary, records] = await Promise.all([
    getAttendanceSummary(),
    getAttendanceRecords(),
  ]);

  return <AttendanceView initialSummary={summary} initialRecords={records} />;
}
