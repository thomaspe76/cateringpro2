import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Keine Authentifizierung, Zugriff verweigert' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: 'Ungültiger Token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token ist ungültig' });
  }
};

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Nicht authentifiziert' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Zugriff verweigert - Admin-Rechte erforderlich' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server-Fehler' });
  }
}; 