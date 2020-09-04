import { Request, Response, NextFunction } from "express";
import AuthService from '@src/services/auth'

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers?.['x-access-token'];
    try {
        const decoded = AuthService.decodeToken(token as string);
        req.payload = decoded;
        next();
    } catch (error) {
        res.status?.(401).send({ code: 401, error: error.message });
    }
}