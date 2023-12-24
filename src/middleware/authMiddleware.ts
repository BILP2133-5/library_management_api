import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secretkey = process.env.JWT_SECRET as string;

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7); 

    try {
      const decoded: any = jwt.verify(token, secretkey);
      (req as any).user = decoded;
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error);
      res.status(401).json({ error: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ error: 'Invalid authentication format' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (user && user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Only admin users can perform this action.' });
  }
};

export const isSuperadmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (user && user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Only superadmin users can perform this action.' });
  }
};
