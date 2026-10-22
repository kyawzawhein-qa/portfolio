/**
 * Resolve the client IP behind Caddy / other reverse proxies.
 * Uses the first hop in X-Forwarded-For, then X-Real-IP, then optional fallbacks.
 */
export function getClientIpFromHeaders(headerList: Headers): string | null {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    const firstHop = forwarded.split(",")[0]?.trim();
    if (firstHop) return firstHop;
  }

  const realIp = headerList.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const cfConnecting = headerList.get("cf-connecting-ip")?.trim();
  if (cfConnecting) return cfConnecting;

  return null;
}
