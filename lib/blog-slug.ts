const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 200;

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidBlogSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= MAX_SLUG_LENGTH && SLUG_PATTERN.test(slug);
}

export function normalizeBlogSlug(input: string): string {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return "";
  if (SLUG_PATTERN.test(trimmed)) return trimmed.slice(0, MAX_SLUG_LENGTH);
  return slugifyTitle(trimmed).slice(0, MAX_SLUG_LENGTH);
}
