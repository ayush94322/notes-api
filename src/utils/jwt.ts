import jwt from "jsonwebtoken";
import {env} from "../config/env.js";
import { Role } from "../generated/prisma/enums.js";

export interface JwtPayload {
    id: string;
    email: string;
    role: Role;
}

export function signAccessToken(payload: JwtPayload) {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: "15m"
    });
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
}