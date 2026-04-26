import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../env.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = resolve(__dirname, '../../cache');
const CACHE_DURATION_SEC = 2592000;
function cachePathSync(prompt: string): string {
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
  return resolve(CACHE_DIR, `${createHash('md5').update(prompt).digest('hex')}.json`);
}

export async function generateContent(prompt: string, forceRefresh = false): Promise<Record<string, unknown> | unknown[] | null> {
  const file = cachePathSync(prompt);
  if (!forceRefresh && existsSync(file)) {
    try {
      const raw = readFileSync(file, 'utf8');
      const data = JSON.parse(raw) as { timestamp: number; payload: unknown };
      if (data.payload && Date.now() / 1000 - data.timestamp < CACHE_DURATION_SEC) {
        return data.payload as Record<string, unknown>;
      }
    } catch {
      /* ignore */
    }
  }

  const result = await callGemini(prompt);
  if (result) {
    writeFileSync(file, JSON.stringify({ timestamp: Math.floor(Date.now() / 1000), payload: result }));
  }
  return result;
}

async function callGemini(prompt: string): Promise<Record<string, unknown> | unknown[] | null> {
  const apiKey = env.aiApiKey;
  if (!apiKey) return null;

  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 },
      }),
      signal: AbortSignal.timeout(12_000),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      console.error('[AI] Gemini API Error:', res.status, res.statusText, errBody.slice(0, 300));
      return null;
    }
    
    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('[AI] Gemini API returned no text:', JSON.stringify(json).slice(0, 200));
      return null;
    }

    return parseAiJson(text);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[AI] Gemini fetch exception:', msg);
    return null;
  }
}

/**
 * Parse JSON từ output AI – xử lý nhiều dạng markdown/code fence mà Gemini thường trả về.
 */
function parseAiJson(raw: string): Record<string, unknown> | unknown[] | null {
  let cleaned = raw.trim();

  // Strip markdown code fences: ```json ... ``` or ``` ... ```
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) cleaned = fenceMatch[1]!.trim();

  // Try direct parse first
  try {
    return JSON.parse(cleaned) as Record<string, unknown> | unknown[];
  } catch { /* continue */ }

  // Fallback: extract first JSON object {...} or array [...]
  const objMatch = cleaned.match(/(\{[\s\S]*\})/);
  if (objMatch) {
    try {
      return JSON.parse(objMatch[1]!) as Record<string, unknown>;
    } catch { /* continue */ }
  }
  const arrMatch = cleaned.match(/(\[[\s\S]*\])/);
  if (arrMatch) {
    try {
      return JSON.parse(arrMatch[1]!) as unknown[];
    } catch { /* continue */ }
  }

  console.error('[AI] Could not parse JSON from AI response:', cleaned.slice(0, 200));
  return null;
}
