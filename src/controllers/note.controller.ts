import type {Request, Response, NextFunction} from "express";
import { NoteService } from "../services/note.service.js";
import { GetNotesOptions } from "../utils/notes.js";

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

    async findAll(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const query = req.validatedData as GetNotesOptions;
            const result = await this.service.findAll({
                ...query,
                userId: req.user!.id
            });
            return res.json(result);
        } catch (error) {
            next(error);
        }
    }
}