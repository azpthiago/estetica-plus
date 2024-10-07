import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

// Configura a biblioteca .env para dar override nas variáveis de ambiente presentes no OS
dotenv.config({ override: true });

// Definição da pool de conexão com o banco de dados a ser utilizada no projeto
export const connection = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
});
