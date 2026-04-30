import { pool } from '../db/pool.js';
import { hashPlainPasswordForAdminStorage } from '../lib/adminPassword.js';

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

async function main(): Promise<void> {
  const email = requiredEnv('ADMIN_EMAIL').toLowerCase();
  const password = requiredEnv('ADMIN_PASSWORD');
  const fullName = process.env.ADMIN_NAME?.trim() || 'Super Admin';
  const phone = process.env.ADMIN_PHONE?.trim() || null;

  if (!email.includes('@')) throw new Error('ADMIN_EMAIL must be a valid email.');
  if (password.length < 12) throw new Error('ADMIN_PASSWORD must be at least 12 characters.');

  const hash = await hashPlainPasswordForAdminStorage(password);
  await pool.query(
    `INSERT INTO quantrivien ("HoTen", "SDT", "Email", "MatKhau")
     VALUES ($1, $2, $3, $4)
     ON CONFLICT ("Email") DO UPDATE SET
       "HoTen" = EXCLUDED."HoTen",
       "SDT" = EXCLUDED."SDT",
       "MatKhau" = EXCLUDED."MatKhau"`,
    [fullName, phone, email, hash]
  );

  console.log(`Admin account is ready: ${email}`);
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
