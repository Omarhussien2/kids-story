// API layer for standalone Vercel deployment
// Calls /api endpoint instead of platform RPC

type RpcParams = {
  func: string;
  args?: Record<string, any>;
};

function getUserFacingErrorMessage(status: number): string {
  if (status === 401) return "Authentication required.";
  if (status === 403) return "Access denied.";
  if (status === 404) return "Resource not found.";
  if (status >= 500) return "Server error. Please try again.";
  return "Request failed. Please try again.";
}

function cacheKey(func: string, args: Record<string, any>): string {
  return `rpc:${func}:${JSON.stringify(args)}`;
}

function getCached<T>(key: string): T | undefined {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return undefined;
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

function setCache(key: string, data: unknown): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

async function fetchApi<T>(func: string, args: Record<string, any>): Promise<T> {
  const res = await fetch('/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ func, args }),
  });

  if (!res.ok) {
    throw new Error(getUserFacingErrorMessage(res.status));
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data as T;
}

/**
 * Clear cached query results.
 */
export function invalidateCache(funcNames?: string[]): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith("rpc:")) {
      if (!funcNames || funcNames.some((fn) => key.includes(`:${fn}:`))) {
        keysToRemove.push(key);
      }
    }
  }
  keysToRemove.forEach((k) => sessionStorage.removeItem(k));
}

/**
 * Main RPC-style call. Translates to REST API call.
 */
export async function rpcCall<T = any>({ func, args = {} }: RpcParams): Promise<T> {
  const key = cacheKey(func, args);

  const cached = getCached<T>(key);
  if (cached !== undefined) {
    console.log("[CACHE_HIT]", { func });
    // Refresh in background
    fetchApi<T>(func, args).then(fresh => setCache(key, fresh)).catch(() => {});
    return cached;
  }

  console.log("[FETCH_START]", { func });
  const data = await fetchApi<T>(func, args);
  setCache(key, data);
  return data;
}

/**
 * Stream call - for story generation, we use the same endpoint but
 * the backend now returns the full result instead of streaming.
 */
export async function streamCall({ func, args = {}, onChunk, onError }: {
  func: string;
  args?: Record<string, any>;
  onChunk: (data: any) => void;
  onError?: (error: Error) => void;
}): Promise<void> {
  try {
    // Simulate streaming progress
    onChunk({ status: "جاري التحضير...", progress: 10 });
    onChunk({ status: "نجمع النجوم لقصتك...", progress: 30 });
    onChunk({ status: "نتأمل المغامرة...", progress: 60 });

    const result = await fetchApi<any>(func, args);

    onChunk({ status: "اللمسات الأخيرة...", progress: 80, story_id: result.id });
    onChunk({ status: "القصة جاهزة!", progress: 100, result });
  } catch (err: any) {
    onError?.(err);
    throw err;
  }
}
