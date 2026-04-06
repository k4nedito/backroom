import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { PostJobForm } from "./post-job-form";

export default async function PostJobPage() {
  const user = await getUser();
  if (!user || user.role !== "seeker") redirect("/auth");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <div className="flex flex-col gap-1 mb-10">
        <h1 className="text-sm font-medium tracking-tight">Post a job</h1>
        <p className="text-[11px] text-muted-foreground/60 tracking-wide">
          Describe what you need built. Be specific — builders read every word.
        </p>
      </div>
      <PostJobForm />
    </div>
  );
}
