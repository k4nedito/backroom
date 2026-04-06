import { cookies } from "next/headers";

export type User = {
  id: string;
  email: string;
  name: string;
  role: "seeker" | "builder";
};

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name ?? payload.email.split("@")[0],
      role: payload.role,
    };
  } catch {
    return null;
  }
}
