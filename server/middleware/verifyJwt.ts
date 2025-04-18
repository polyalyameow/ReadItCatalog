import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/db';
import { jwtBlacklist, users } from '../db/schema';
import { eq } from "drizzle-orm";

export interface AuthRequest<P = any> extends Request<P> {
  currentUser?: { id: string };
}

const isTokenBlacklisted = async (token: string) => {
  const blacklistedToken = await db.select().from(jwtBlacklist).where(eq(jwtBlacklist.token, token)).limit(1).execute();
  return blacklistedToken.length > 0;
};


export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers['authorization']?.split(' ')[1];
  
    if (!token) {
      res.status(403).json({ message: 'Token is required' });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      
      if (await isTokenBlacklisted(token)) {
        res.status(401).json({ message: "Token is invalid or has been logged out" });
        return;
      }  

      const userId = String(decoded.userId); 
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1).execute();
  
      if (!user.length) {
        res.status(401).json({ message: 'User not found' });
        return;
      }
  
      req.currentUser = { id: user[0].id };
      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Invalid token' });
    }
  };