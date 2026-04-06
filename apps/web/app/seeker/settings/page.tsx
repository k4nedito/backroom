import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { api } from "@/lib/api";
import { SettingsForm } from "./settings-form";

type Seeker = {
  id: string;
  email: string;
  name: string;
  company: string | null;
};

export default async function SettingsPage() {
  const user = await getUser();
  if (!user || user.role !== "seeker") redirect("/auth");

  const { data } = await api<{ seeker: Seeker }>("/seeker/settings", {
    method: "GET",
  });

  if (!data?.seeker) redirect("/auth");

  return (
    <div className="flex-1 flex items-center justify-center"><div className="w-full max-w-lg px-4 py-10">
      <div className="flex flex-col gap-1 mb-10">
        <h1 className="text-sm font-medium tracking-tight">Settings</h1>
        <p className="text-[11px] text-muted-foreground/60 tracking-wide">
          Manage your account.
        </p>
      </div>
      <SettingsForm seeker={data.seeker} />
    </div></div>
  );
}
