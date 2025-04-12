import jwt, { SignOptions } from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";


export const generateJWT = (userId: string) => {
  const payload = {
    userId,
  };

  const options: SignOptions = {
    expiresIn: '10h',
  };

  return jwt.sign(payload, JWT_SECRET, options);
};
