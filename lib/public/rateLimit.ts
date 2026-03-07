/**
 * Rate limit in-memory por IP (para POST /api/public/lead).
 * 10 requisições por 10 minutos por IP.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 10;

const store = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

export function checkRateLimit(request: Request): { ok: boolean; retryAfter?: number } {
  const ip = getClientIp(request);
  const now = Date.now();
  let entry = store.get(ip);
  if (!entry) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (now >= entry.resetAt) {
    entry = { count: 1, resetAt: now + WINDOW_MS };
    store.set(ip, entry);
    return { ok: true };
  }
  entry.count += 1;
  if (entry.count > MAX_REQUESTS) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true };
}
