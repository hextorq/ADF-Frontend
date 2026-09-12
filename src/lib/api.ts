export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");
const API_PREFIX = API_BASE_URL ? `${API_BASE_URL}/api` : "/api";
const AUTH_TOKEN_KEY = "adf_admin_token";

function apiUrl(path: string) {
  return `${API_PREFIX}${path}`;
}

export function assetUrl(url: string) {
  if (!API_BASE_URL || !url.startsWith("/uploads/")) return url;
  return `${API_BASE_URL}${url}`;
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

function authHeaders(headers?: HeadersInit): HeadersInit {
  const token = getAuthToken();
  return {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Safe fetch wrapper that handles:
 * - Non-2xx HTTP responses (4xx, 5xx)
 * - Empty response bodies (0 bytes)
 * - Non-JSON content types (e.g. text/html error pages)
 * - Blocked or aborted requests (e.g. robots.txt or offline)
 *
 * Never throws SyntaxError: Unexpected end of JSON input.
 */
export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit,
  fallback: T = [] as any
): Promise<{ data: T; ok: boolean; status: number }> {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      return { data: fallback, ok: false, status: res.status };
    }

    if (res.status === 204) {
      return { data: fallback, ok: true, status: res.status };
    }

    const contentType = res.headers.get("content-type") || "";
    const text = await res.text();
    if (!text || !text.trim()) {
      return { data: fallback, ok: true, status: res.status };
    }

    const trimmed = text.trim();
    if (
      !contentType.includes("application/json") &&
      !trimmed.startsWith("{") &&
      !trimmed.startsWith("[")
    ) {
      return { data: fallback, ok: false, status: res.status };
    }

    const data = JSON.parse(text) as T;
    return { data, ok: true, status: res.status };
  } catch {
    return { data: fallback, ok: false, status: 0 };
  }
}

export async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(apiUrl(path), {
    credentials: "include",
    headers: authHeaders({ "Content-Type": "application/json" }),
    ...opts,
  });

  const text = await res.text();

  if (!res.ok) {
    let message = res.statusText;
    if (text && text.trim()) {
      try {
        const body = JSON.parse(text);
        if (body?.error) message = body.error;
      } catch {
        // ignore non-JSON error bodies
      }
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204 || !text || !text.trim()) return undefined as T;
  
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError(res.status, "Invalid JSON response from server");
  }
}

export type AdminUser = { email: string; role: string };
export type LoginResponse = { token: string; user: AdminUser };
export type ContentAuditLog = {
  id: string;
  content_key: string;
  old_value: string | null;
  new_value: string;
  admin_email: string;
  created_at: string;
};

export function login(email: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login", {
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

export function fetchRecentContentEdits() {
  return apiFetch<{ edits: ContentAuditLog[] }>("/content/audit/recent");
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
  const res = await fetch(apiUrl("/uploads/image"), {
    method: "POST",
    credentials: "include",
    headers: authHeaders(),
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

  const parsed = (await res.json()) as { url: string };
  return { url: assetUrl(parsed.url) };
}

export function checkSmtpStatus() {
  return apiFetch<{
    configured: boolean;
    user: string | null;
    host: string;
    port: string;
    receiver: string;
    ok: boolean;
    message: string;
  }>("/forms/smtp-status");
}

export function sendTestEmailApi(to?: string) {
  return apiFetch<{
    success: boolean;
    messageId?: string;
    error?: string;
  }>("/forms/test-email", {
    method: "POST",
    body: JSON.stringify({ to }),
  });
}

