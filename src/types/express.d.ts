export interface User {
    id: string;
    username: string;
    hash: string;
    salt: string;
  }
  

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
