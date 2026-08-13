import type {Request, Response} from "express";
import { NoteService } from "../services/note.service.js";
import { GetNotesOptions } from "../utils/notes.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "zod";

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

    update = asyncHandler(async(
        req: Request,
        res: Response
    )=>{
        const {id, ...updatedData} = req.validatedData as {
            id: string
        };
        const updatedNote = await this.service.update(
            id,
            req.user!.id,
            updatedData
        );
        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: updatedNote
        });
    })

    delete = asyncHandler(async (
        req: Request,
        res: Response
    )=>{
        const {id} = req.validatedData as {id: string};

        await this.service.softDelete(
            id,
            req.user!.id
        );

        res.status(204).json({
            success: true,
            message: "Deleted successfully"
        });
    });

    restore = asyncHandler(async(
        req: Request,
        res: Response
    )=>{
        const {id} = req.validatedData as {id: string};
        await this.service.restore(
            id,
            req.user!.id
        );
        res.status(200).json({
            success: true,
            message: "Note restore successful"
        });
    })

    permanentDelete = asyncHandler(async (
        req: Request,
        res: Response
    ) => {
        const {id} = req.validatedData as {id: string};
        await this.service.permanentDelete(
            id,
            req.user!.id
        );
        
        res.status(200).json({
            success: true,
            message: "Note permanently deleted"
        });
    });

    bulkDelete = asyncHandler(async (
        req: Request,
        res: Response
    )=>{
        const {ids} = req.validatedData as {
            ids: string[];
        }; 
        const result = await this.service.bulkDelete(
            ids,
            req.user!.id
        );
        res.json({
            success: true,
            ...result
        });
    })

    bulkFavorite = asyncHandler(async (
        req: Request,
        res: Response
    ) => {
        const {ids} = req.validatedData as {
            ids: string[]
        };
        const result = await this.service.bulkFavorite(
            ids,
            req.user!.id
        );
        res.json(result);
    });

    bulkRestore = asyncHandler(async (
        req: Request,
        res: Response
    )=>{
        const {ids} = req.validatedData as {
            ids: string[]
        };
        const result = await this.service.bulkRestore(
            ids,
            req.user!.id
        );
        res.json(result);
    });

    bulkArchive = asyncHandler(async (
        req: Request,
        res: Response
    )=>{
        const {ids} = req.validatedData as {
            ids: string[]
        };
        const result = await this.service.bulkArchive(
            ids,
            req.user!.id
        );
        res.json(result);
    });

    
}