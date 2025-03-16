// Index file to ensure folder is kept in source control
import 'express';
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
