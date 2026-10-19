import { notFound } from "next/navigation";
import { getMemberDetails } from "@/server/services/member.service";
import { MemberProfileView } from "@/components/admin/members/member-profile-view";

export const metadata = {
  title: "Member Profile",
  description: "View and manage gym member profile and activity history.",
};

interface MemberDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function MemberDetailsPage({
  params,
}: MemberDetailsPageProps) {
  const { id } = await params;
  const details = await getMemberDetails(id);

  if (!details) {
    notFound();
  }

  return <MemberProfileView details={details} />;
}
