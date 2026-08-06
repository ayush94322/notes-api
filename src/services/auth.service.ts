import { AuthRepository } from "../repositories/auth.repository.js";
import bcrypt from "bcrypt";
import { signAccessToken } from "../utils/jwt.js";

export class AuthService {
    constructor(
        private readonly repository = new AuthRepository()
    ){}

    async login(email: string, password: string) {
        const user = await this.repository.findByEmail(email);

        if(!user) {
            throw new Error("Invalid email or password");
        }
        console.log(password, user.passwordHash);
        const matched = await bcrypt.compare(
            password,
            user.passwordHash
        );
        if(!matched) {
            throw new Error("Invalid email or password");
        }

        const accessToken = signAccessToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };
    }
}