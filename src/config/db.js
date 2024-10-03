import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ override: true });

export const connection = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
});
