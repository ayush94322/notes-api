import {ZodType} from "zod";
import type { RequestHandler } from "express";

export function validate(schema: ZodType): RequestHandler {
    return (req, res, next)=>{
        try {
            const result = schema.safeParse(req.body);
            req.validatedData = result.data;
            next();
        } catch (error) {
            next(error);
        }
    }
}