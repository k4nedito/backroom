import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { api } from "@/lib/api";
import { ProfileForm } from "./profile-form";

export type WorkHistoryEntry = {
  company: string;
  role: string;
  from: string;
  to: string | null;
  description: string;
};

export type EducationEntry = {
  institution: string;
  degree: string;
  field: string;
  from: string;
  to: string | null;
};

export type Builder = {
  id: string;
  email: string;
  name: string;
  title: string | null;
  bio: string | null;
  skills: string[];
  hourlyRate: number | null;
  availability: "full_time" | "part_time" | "not_available" | null;
  timezone: string | null;
  website: string | null;
  github: string | null;
  languages: string[];
  workHistory: WorkHistoryEntry[];
  education: EducationEntry[];
  profileComplete: boolean;
  createdAt: string;
};

export default async function BuilderProfilePage() {
  const user = await getUser();
  if (!user || user.role !== "builder") redirect("/auth");

  const { data } = await api<{ builder: Builder }>("/builder/settings", {
    method: "GET",
  });

  if (!data?.builder) redirect("/auth");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <div className="flex items-start justify-between mb-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-sm font-medium tracking-tight text-primary">Profile</h1>
          <p className="text-[11px] text-muted-foreground/60 tracking-wide">
            How seekers see you. Fill out more to rank higher in search.
          </p>
        </div>
      </div>
      <ProfileForm builder={data.builder} />
    </div>
  );
}
