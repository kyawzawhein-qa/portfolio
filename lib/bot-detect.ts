const BOT_UA_PATTERN =
  /bot|crawler|spider|slurp|headless|preview|facebookexternalhit|whatsapp|telegram|discord|googlebot|bingbot|yandex|baidu|duckduckbot|semrush|ahrefs|petalbot|bytespider|curl\/|wget\/|python-requests|go-http-client|java\/|libwww|scrapy/i;

export function isLikelyBot(userAgent: string | null): boolean {
  if (!userAgent || userAgent.trim().length < 2) return true;
  return BOT_UA_PATTERN.test(userAgent);
}
