const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function api<T>(
  path: string,
  options?: RequestInit,
): Promise<{ data?: T; error?: { code: string; message: string } }> {
  const { headers, ...rest } = options ?? {};

  const isServer = typeof window === "undefined";
  let cookieHeader: Record<string, string> = {};

  if (isServer) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const all = cookieStore.getAll();
    if (all.length) {
      cookieHeader = {
        cookie: all.map((c) => `${c.name}=${c.value}`).join("; "),
      };
    }
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    credentials: isServer ? undefined : "include",
    headers: {
      "Content-Type": "application/json",
      ...cookieHeader,
      ...headers,
    },
  });

  const json = await res.json();

  if (!res.ok) return { error: json.error };
  return { data: json as T };
}
