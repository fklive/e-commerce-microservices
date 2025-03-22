import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Request'e user özelliği eklemek için tip tanımlaması
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Token'ı header'dan al
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
     res.status(401).json({ 
      success: false,
      message: 'Yetkilendirme gerekli' 
    });
    return;
  }

  try {
    // Token'ı doğrula
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Decoded payload'ı request nesnesine ekle
    req.user = decoded;
    
    next();
  } catch (error) {
     res.status(401).json({ 
      success: false,
      message: 'Geçersiz token' 
    });
  }
  return;
};