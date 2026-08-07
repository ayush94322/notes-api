import { NextFunction, Request, Response } from "express";
import {Prisma} from "../generated/prisma/client.js";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";
import jwt from "jsonwebtoken";

export const errorHandler = (
        err: unknown,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        console.error(err);

        if(err instanceof AppError) {
            return res.status(err.statusCode).json({
                succes: false,
                message: err.message,
            });
        }
        if(err instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation Failed",
                errors: err.issues
            });
        }
        if(err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: "Access token has expired"
            });
        }
        if(err instanceof jwt.NotBeforeError) {
            return res.status(401).json({
                success: false,
                message: "Access token is not active"
            });
        }
        if(err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "Invalid access token"
            });
        }
        if(err instanceof Prisma.PrismaClientKnownRequestError) {
            switch(err.code) {
                case "P2002": 
                    return res.status(409).json({
                        succes: false,
                        message: "Resources already exists",
                    });
                case "P2025":
                    return res.status(404).json({
                        success: false,
                        message: "Resource not found"
                    });
            }
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    };