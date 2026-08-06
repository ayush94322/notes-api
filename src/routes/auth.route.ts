import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema } from "../validators/auth.validator.js";

const router = Router();

const controller = new AuthController();

router.post("/login", validate(loginSchema), controller.login.bind(controller));

export default router;