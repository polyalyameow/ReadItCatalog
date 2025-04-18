import { drizzle } from 'drizzle-orm/mysql2';
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import logger from '../logger';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    logger.debug("Testing database connection...");
    const connection = await pool.getConnection();
    logger.debug("Successfully connected to the database!");
    connection.release();
  } catch (error: any) {
    logger.error("Database connection failed:", error.message);
  }
})();

//export default pool;
export const db = drizzle(pool);
