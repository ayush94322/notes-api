import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
    constructor(
        private service = new AuthService()
    ){}
    
    async login(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const {email, password} = req.body;
            const result = await this.service.login(
                email,
                password
            );
            res.status(200).json({
                accessToken: result.accessToken,
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    role: result.user.role
                },
                msg: "login successfull"
            });
        } catch (error) {
            next(error);
        }
    }
}