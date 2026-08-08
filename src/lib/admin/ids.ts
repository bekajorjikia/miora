export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function createEntityId(nameEn: string): string {
  const base = slugify(nameEn) || "item";
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}
