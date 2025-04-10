import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/db';
import { users } from '../db/schema';
import { eq } from "drizzle-orm";
import { User } from '../../types/types';

export interface AuthRequest<P = any> extends Request<P> {
  currentUser?: { id: string };
}


export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  console.log(`[verifyToken] Incoming path: ${req.path}`);  
  const token = req.headers['authorization']?.split(' ')[1];
    console.log(req.headers);
  
    if (!token) {
      res.status(403).json({ message: 'Token is required' });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        
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