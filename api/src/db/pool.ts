import { Pool, types } from 'pg';
import { env } from '../env.js';

// Parse NUMERIC/DECIMAL as float instead of string
types.setTypeParser(1700, (val: string) => parseFloat(val));

export const pool = env.db.connectionString
  ? new Pool({
      connectionString: env.db.connectionString,
      ssl: env.db.ssl ? { rejectUnauthorized: false } : undefined,
      max: 10,
    })
  : new Pool({
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      database: env.db.database,
      ssl: env.db.ssl ? { rejectUnauthorized: false } : undefined,
      max: 10,
    });
