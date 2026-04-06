const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function api<T>(
  path: string,
  options?: RequestInit,
): Promise<{ data?: T; error?: { code: string; message: string } }> {
  const { headers, ...rest } = options ?? {};

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: { "Content-Type": "application/json", ...headers },
  });

  const json = await res.json();

  if (!res.ok) return { error: json.error };
  return { data: json as T };
}
