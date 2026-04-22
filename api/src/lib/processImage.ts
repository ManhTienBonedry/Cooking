import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Max base64 payload size (~10 MB raw ≈ ~13.3 MB base64) */
const MAX_BASE64_LENGTH = 14_000_000;

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

  if (base64Data.length > MAX_BASE64_LENGTH) {
    console.error(`Image too large: ${(base64Data.length / 1_000_000).toFixed(1)} MB (max ${(MAX_BASE64_LENGTH / 1_000_000).toFixed(0)} MB)`);
    return null;
  }

  // Parse header to get extension, e.g., "data:image/jpeg;base64"
  let ext = 'png';
  if (header.includes('image/jpeg') || header.includes('image/jpg')) ext = 'jpg';
  else if (header.includes('image/webp')) ext = 'webp';
  else if (header.includes('image/gif')) ext = 'gif';

  // We write it to the web public folder so Vite can just serve it out of the box locally.
  // Path from api/src/lib/ (dev via tsx) or api/dist/lib/ (prod via node):
  //   3 levels up → api/ → Cook/ then → web/public/uploads
  const filename = `img_${Date.now()}_${Math.floor(Math.random() * 10000)}.${ext}`;
  const webPublicUploadsDir = resolve(__dirname, '../../../web/public/uploads');

  try {
    // Ensure uploads directory exists
    if (!existsSync(webPublicUploadsDir)) {
      mkdirSync(webPublicUploadsDir, { recursive: true });
      console.log(`Created uploads directory: ${webPublicUploadsDir}`);
    }

    writeFileSync(resolve(webPublicUploadsDir, filename), Buffer.from(base64Data, 'base64'));
    console.log(`Image saved: ${webPublicUploadsDir}/${filename}`);
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Failed to save base64 image to disk:', error);
    console.error('Attempted path:', webPublicUploadsDir);
    return null;
  }
}
