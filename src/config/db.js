import { createPool } from "mysql2/promise";

const connection = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
});

async function getUserById(id) {
  const [rows] = await connection.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
}

export default { getUserById, connection };
