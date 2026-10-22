import { FeesView } from "@/components/admin";
import {
  getFeesSummary,
  getFeeRecords,
  getDemoMembers,
} from "@/server/services/fees.service";

export const metadata = {
  title: "Fees & Payments",
  description: "Track membership fees, payments, and outstanding dues.",
};

export default async function AdminFeesPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string; record?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const [summary, records, demoMembers] = await Promise.all([
    getFeesSummary(),
    getFeeRecords(),
    getDemoMembers(),
  ]);

  return (
    <FeesView
      initialSummary={summary}
      initialRecords={records}
      demoMembers={demoMembers}
      initialSearch={params?.search || ""}
      initialRecordCode={params?.record || ""}
    />
  );
}
