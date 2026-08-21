/** Convert GEL major units (e.g. 24.5) to tetri. */
export function majorToMinor(major: number): number {
  return Math.round(major * 100);
}

/** Convert tetri to GEL major units for form inputs. */
export function minorToMajor(minor: number): number {
  return minor / 100;
}

export function parsePriceMajor(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }

  const value = Number(trimmed.replace(",", "."));
  if (!Number.isFinite(value) || value < 0) {
    throw new Error("ფასი უნდა იყოს არაუარყოფითი რიცხვი.");
  }

  return value;
}
