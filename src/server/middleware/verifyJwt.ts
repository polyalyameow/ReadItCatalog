import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/db';
import { users } from '../db/schema';
import { eq } from "drizzle-orm";

interface User {
    id: string;
    username: string;
    hash: string;
    salt: string;
  }

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming Bearer token in the Authorization header
  
    if (!token) {
      return res.status(403).json({ message: 'Token is required' });
    }
  
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        
      const userId = String(decoded.userId); 
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1).execute();
  
      if (!user.length) {
        return res.status(401).json({ message: 'User not found' });
      }
  
      req.user = user[0] as User;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: 'Invalid token' });
    }
  };