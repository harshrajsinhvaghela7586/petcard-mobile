import { tokenStorage } from "./tokenStorage";

// Set EXPO_PUBLIC_API_URL to the backend origin, e.g. https://your-app.onrender.com (no trailing slash).
const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
const TIMEOUT_MS = 20000; // Render free tier cold starts can be slow.

export class ApiError extends Error {
  status: number;
  code?: string;
  retryAfterSeconds?: number;
  data?: Record<string, unknown>;
  constructor(status: number, message: string, data?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.code = data?.code as string | undefined;
    this.retryAfterSeconds = data?.retryAfterSeconds as number | undefined;
    this.data = data;
  }
}

type Options = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean; // default true
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

let onSessionExpired: (() => void) | null = null;
export const setSessionExpiredHandler = (fn: (() => void) | null) => {
  onSessionExpired = fn;
};

async function rawFetch(path: string, opts: Options, token?: string | null) {
  if (!API_URL) {
    throw new ApiError(0, "App is not configured (EXPO_PUBLIC_API_URL is missing).", {
      code: "NO_API_URL",
    });
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  opts.signal?.addEventListener("abort", () => controller.abort());

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: opts.method ?? "GET",
      headers: {
        Accept: "application/json",
        ...(opts.body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(opts.headers ?? {}),
      },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      signal: controller.signal,
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      throw new ApiError(res.status, data?.message || "Something went wrong.", data ?? undefined);
    }
    return data;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    const aborted = (e as Error)?.name === "AbortError";
    throw new ApiError(
      0,
      aborted ? "The server is taking too long. Please try again." : "No internet connection.",
      { code: aborted ? "TIMEOUT" : "NETWORK" }
    );
  } finally {
    clearTimeout(timer);
  }
}

// One refresh at a time: concurrent 401s share the same promise.
let refreshing: Promise<string> | null = null;

async function refreshSession(): Promise<string> {
  if (!refreshing) {
    refreshing = (async () => {
      const refreshToken = await tokenStorage.getRefresh();
      if (!refreshToken) throw new ApiError(401, "Signed out.", { code: "SESSION_EXPIRED" });
      const data = await rawFetch("/api/mobile-auth/refresh", {
        method: "POST",
        body: { refreshToken },
        auth: false,
      });
      await tokenStorage.saveTokens(data.accessToken, data.refreshToken);
      return data.accessToken as string;
    })().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

const inflightGets = new Map<string, Promise<any>>();

/** Clear deduplication entries on logout/account switch. */
export function clearApiInflight() {
  inflightGets.clear();
}

export async function api<T = any>(path: string, opts: Options = {}): Promise<T> {
  const useAuth = opts.auth !== false;

  const run = async (): Promise<T> => {
    if (!useAuth) return rawFetch(path, opts);

    try {
      return await rawFetch(path, opts, tokenStorage.getAccess());
    } catch (e) {
      if (!(e instanceof ApiError) || e.status !== 401) throw e;
      if (e.code !== "TOKEN_EXPIRED" && e.code !== "AUTH_REQUIRED") throw e;

      try {
        const fresh = await refreshSession();
        return await rawFetch(path, opts, fresh);
      } catch (inner) {
        // Only a real auth rejection ends the session. Network errors must NOT log the user out.
        if (inner instanceof ApiError && inner.status === 401) {
          await tokenStorage.clear();
          onSessionExpired?.();
        }
        throw inner;
      }
    }
  };

  // De-duplicate identical in-flight GETs.
  if ((opts.method ?? "GET") === "GET") {
    const requestKey = `${tokenStorage.getAccess() ?? "signed-out"}:${path}`;
    const existing = inflightGets.get(requestKey);
    if (existing) return existing;
    const p = run().finally(() => inflightGets.delete(requestKey));
    inflightGets.set(requestKey, p);
    return p;
  }
  return run();
}
