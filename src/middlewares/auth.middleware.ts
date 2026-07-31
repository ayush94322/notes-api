import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader?.startsWith("Bearer")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
        const token = authHeader.slice(7);
        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}