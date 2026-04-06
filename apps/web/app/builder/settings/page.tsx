import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { api } from "@/lib/api";
import { SettingsForm } from "./settings-form";

type Builder = {
  id: string;
  email: string;
  name: string;
};

export default async function BuilderSettingsPage() {
  const user = await getUser();
  if (!user || user.role !== "builder") redirect("/auth");

  const { data } = await api<{ builder: Builder }>("/builder/settings", {
    method: "GET",
  });

  if (!data?.builder) redirect("/auth");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <div className="flex flex-col gap-1 mb-10">
        <h1 className="text-sm font-medium tracking-tight">Settings</h1>
        <p className="text-[11px] text-muted-foreground/60 tracking-wide">
          Account and email.
        </p>
      </div>
      <SettingsForm builder={data.builder} />
    </div>
  );
}
