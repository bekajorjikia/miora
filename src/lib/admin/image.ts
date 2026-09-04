/** Longest edge of a stored dish photo — plenty for the menu card and detail sheet. */
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.8;
/** Files under this are already cheap to upload; skip the re-encode. */
const SKIP_BELOW_BYTES = 512 * 1024;
/** Vercel rejects request bodies above 4.5 MB before they reach the server action. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

function scaledSize(width: number, height: number): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (longest <= MAX_DIMENSION) {
    return { width, height };
  }
  const ratio = MAX_DIMENSION / longest;
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

function renamedAsJpeg(name: string): string {
  const base = name.replace(/\.[^.]+$/, "") || "photo";
  return `${base}.jpg`;
}

/**
 * Re-encode a picked photo in the browser so the server action body stays small.
 * Returns the original file when it is already small or cannot be decoded here
 * (e.g. HEIC in a browser without support) — the caller still size-checks it.
 */
export async function shrinkImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size <= SKIP_BELOW_BYTES) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const { width, height } = scaledSize(bitmap.width, bitmap.height);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return file;
    }
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
    });

    if (!blob || blob.size >= file.size) {
      return file;
    }

    return new File([blob], renamedAsJpeg(file.name), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}
