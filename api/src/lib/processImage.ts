import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Extracts a base64 image (data URI), saves it to disk, and returns the public path.
 * If the input is not a data URI, it returns the input unmodified.
 * @param input The image string (data URI or regular URL string)
 */
export function processImageBase64(input: string | null): string | null {
  if (!input) return null;
  // Format: data:image/jpeg;base64,...
  if (!input.startsWith('data:')) return input;

  const commaIdx = input.indexOf(',');
  if (commaIdx === -1) return input;

  const header = input.slice(0, commaIdx);
  const base64Data = input.slice(commaIdx + 1);

  // Parse header to get extension, e.g., "data:image/jpeg;base64"
  let ext = 'png';
  if (header.includes('image/jpeg') || header.includes('image/jpg')) ext = 'jpg';
  else if (header.includes('image/webp')) ext = 'webp';
  else if (header.includes('image/gif')) ext = 'gif';

  // We write it to the web public folder so Vite can just serve it out of the box locally
  const filename = `img_${Date.now()}_${Math.floor(Math.random() * 10000)}.${ext}`;
  const webPublicUploadsDir = resolve(__dirname, '../../../../web/public/uploads');

  try {
    writeFileSync(resolve(webPublicUploadsDir, filename), Buffer.from(base64Data, 'base64'));
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Failed to save base64 image to disk:', error);
    // Return original string if disk write fails
    return input;
  }
}
