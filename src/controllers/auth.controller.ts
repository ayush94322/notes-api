import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export class AuthController {
    constructor(
        private service = new AuthService()
    ){}
    
    login = asyncHandler( async (
        req: Request,
        res: Response
    ) => {
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
    })
}