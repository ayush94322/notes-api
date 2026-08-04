import {ZodType} from "zod";
import type { RequestHandler } from "express";

type RequestPart = "body" | "query" | "params";

export function validate(schema: ZodType, source: RequestPart = "body"): RequestHandler {
    return (req, res, next)=>{
        try {
            const result = schema.safeParse(req[source]);
            req.validatedData = result.data;
            next();
        } catch (error) {
            next(error);
        }
    }
}