import { SettingsView } from "@/components/admin";
import { getGymSettings } from "@/server/services/settings.service";

export const metadata = {
  title: "Gym Settings",
  description: "Manage your gym profile, contact details, and membership defaults.",
};

export default async function AdminSettingsPage() {
  const initialSettings = await getGymSettings();

  return <SettingsView initialSettings={initialSettings} />;
}
