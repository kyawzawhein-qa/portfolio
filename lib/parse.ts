export function parseJsonStringArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

export function stringifyTechList(raw: FormDataEntryValue | null): string {
  const value = String(raw || "").trim();
  if (!value) return "[]";
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return JSON.stringify(parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0));
    }
  } catch {
    // fall through to comma/newline split
  }
  const items = value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
  return JSON.stringify(items);
}

export function stringifyHeroTags(raw: FormDataEntryValue | null): string {
  return stringifyTechList(raw);
}
