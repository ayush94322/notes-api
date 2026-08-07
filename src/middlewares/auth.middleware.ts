import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";

export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    if(!authHeader?.startsWith("Bearer ")) {
        throw new UnauthorizedError("Access token is required");
    }
    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
}