import mysql from "mysql2/promise";
import dotenv from "dotenv";

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
    console.log("🔍 Testing database connection...");
    const connection = await pool.getConnection();
    console.log("✅ Successfully connected to the database!");
    connection.release();
  } catch (error: any) {
    console.error("❌ Database connection failed:", error.message);
  }
})();

export default pool;
