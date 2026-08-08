import type {Request, Response} from "express";
import { NoteService } from "../services/note.service.js";
import { GetNotesOptions } from "../utils/notes.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export class NoteController {
    constructor(
        private service = new NoteService()
    ) {}

    create = asyncHandler(async (
        req: Request,
        res: Response
    ) => {
        const {title, content} = req.validatedData as {
            title: string;
            content: string;
        };
        const note = await this.service.create(
            title,
            content,
            req.user!.id
        );
        return res.status(201).json(note);
    });

    findById = asyncHandler(async (
        req: Request,
        res: Response
    ) => {
        const {id} = req.validatedData as {id: string};
        const note = await this.service.findById(
            id,
            req.user!.id
        );
        return res.json(note);
    })

    findAll = asyncHandler(async (
        req: Request,
        res: Response
    ) => {
        const query = req.validatedData as GetNotesOptions;
        const result = await this.service.findAll({
            ...query,
            userId: req.user!.id
        });
        return res.json(result);
    });
}