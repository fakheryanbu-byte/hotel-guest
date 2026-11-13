export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
] as const;

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

export function isSupportedImageFile(file: File): boolean {
  if ((ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type.toLowerCase())) {
    return true;
  }
  const lower = file.name.toLowerCase();
  return (
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.png') ||
    lower.endsWith('.webp') ||
    lower.endsWith('.heic') ||
    lower.endsWith('.heif')
  );
}

export function inferMimeType(file: File): string {
  if (file.type && (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type.toLowerCase())) {
    return file.type.toLowerCase();
  }
  const lower = file.name.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.heic')) return 'image/heic';
  if (lower.endsWith('.heif')) return 'image/heif';
  return 'image/jpeg';
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read image file'));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error('File read error'));
    reader.readAsDataURL(file);
  });
}

/**
 * Prepares an image for temporary Gemini analysis while preserving legibility of fine text/MRZ.
 * Only gently downscales images larger than 2400px or 3.5MB when canvas supports the format.
 */
export async function prepareImageForUpload(
  file: File
): Promise<{ base64: string; mimeType: string }> {
  const mimeType = inferMimeType(file);
  const dataUrl = await readFileAsDataUrl(file);

  // For HEIC/HEIF or already crisp reasonable images <= 3.5 MB, keep original bytes untouched
  if (mimeType === 'image/heic' || mimeType === 'image/heif' || file.size <= 3.5 * 1024 * 1024) {
    const base64 = dataUrl.split(',')[1] ?? '';
    return { base64, mimeType };
  }

  // Gently downscale oversized photos (> 3.5 MB) to max 2400px while preserving high JPEG quality (0.92)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Image decode error'));
      el.src = dataUrl;
    });

    const maxDim = 2400;
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const targetW = Math.round(img.width * scale);
    const targetH = Math.round(img.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      const base64 = dataUrl.split(',')[1] ?? '';
      return { base64, mimeType };
    }
    ctx.drawImage(img, 0, 0, targetW, targetH);
    const outDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const base64 = outDataUrl.split(',')[1] ?? '';
    return { base64, mimeType: 'image/jpeg' };
  } catch {
    const base64 = dataUrl.split(',')[1] ?? '';
    return { base64, mimeType };
  }
}
