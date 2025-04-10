import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in .env");
}

export const JWT_SECRET = process.env.JWT_SECRET;
