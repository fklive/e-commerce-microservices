import { Request, Response, NextFunction } from 'express';

export const checkRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {

        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Yetkilendirme gerekli'
            });
            return;
        }

        const userRole = req.user.role

        if (!roles.includes(userRole)) {
            res.status(403).json({
                success: false,
                message: "Bu işlem için yetkiniz yok!"
            });
            return;
        }
        next();



    }

}