import jwt, { SignOptions } from "jsonwebtoken";

const generateJWT = (userId: string) => {
    const payload = {
      userId,
    };
  
    const options: SignOptions = {
      expiresIn: '1h',
    };
  
    return jwt.sign(payload, process.env.JWT_SECRET!, options);
  };
  