import type {Request, Response, NextFunction} from "express";
import { NoteService } from "../services/note.service.js";

export class NoteController {
    constructor(
        private service = new NoteService()
    ) {}

    async create(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const {title, content} = req.validatedData as {
                title: string;
                content: string;
            };
            const note = await this.service.create(
                title,
                content,
                req.user!.id
            );
            res.status(201).json(note);
        } catch (error) {
            next(error);
        }
    }
}