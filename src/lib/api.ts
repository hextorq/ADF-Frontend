export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...opts,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export type AdminUser = { email: string; role: string };

export function login(email: string, password: string) {
  return apiFetch<{ user: AdminUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  return apiFetch<void>("/auth/logout", { method: "POST" });
}

export function fetchMe() {
  return apiFetch<{ isAdmin: boolean; email: string | null }>("/auth/me");
}

export function fetchAllContent() {
  return apiFetch<{ items: Record<string, string> }>("/content");
}

export function updateContent(key: string, value: string) {
  return apiFetch<{ key: string; value: string; updated_at: string }>(
    `/content/${encodeURIComponent(key)}`,
    { method: "PATCH", body: JSON.stringify({ value }) }
  );
}

export function submitContact(data: {
  fullName: string;
  email: string;
  affiliation?: string;
  subject: string;
  message: string;
}) {
  return apiFetch<{ id: string; success: boolean }>("/forms/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function submitBoardApplication(data: {
  fullName: string;
  email: string;
  affiliation: string;
  profileLink?: string;
  boardType: "Editorial Board" | "Reviewer Network";
  message?: string;
}) {
  return apiFetch<{ id: string; success: boolean }>("/forms/board-application", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function uploadImage(file: File) {
  const body = new FormData();
  body.append("image", file);
  const res = await fetch("/api/uploads/image", {
    method: "POST",
    credentials: "include",
    body,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const parsed = await res.json();
      if (parsed?.error) message = parsed.error;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<{ url: string }>;
}
