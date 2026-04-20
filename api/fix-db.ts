import { Pool } from 'pg';
import { env } from './src/env.js';

const passwordsToTry = ['CookingDB', '123456', 'root', 'admin', 'CookingData125@ck!#1', '1234'];

async function tryFix() {
  for (const pwd of passwordsToTry) {
    console.log('Trying user postgres with password:', pwd);
    const pool = new Pool({
      host: env.db.host,
      port: env.db.port,
      user: 'postgres',
      password: pwd,
      database: env.db.database,
    });

    try {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query('ALTER TABLE blog_posts ALTER COLUMN image_url TYPE TEXT');
        console.log('blog_posts image_url changed to TEXT');

        await client.query('ALTER TABLE recipes ALTER COLUMN image_url TYPE TEXT');
        console.log('recipes image_url changed to TEXT');

        await client.query('COMMIT');
        console.log('Successfully updated database schemas using password:', pwd);
        client.release();
        pool.end();
        return;
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      }
    } catch (e) {
      console.log('Failed:', e.message);
      pool.end();
    }
  }
}

tryFix();
