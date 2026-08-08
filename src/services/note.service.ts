import { NotFoundError } from "../errors/NotFoundError.js";
import { NoteRepository } from "../repositories/note.repository.js";
import { GetNotesOptions } from "../utils/notes.js";

export class NoteService {
    constructor(
        private repository = new NoteRepository()
    ){}

    async create(
        title: string,
        content: string,
        userId: string
    ) {
        return await this.repository.create({
            title,
            content,
            userId
        });
    }

    async findById(
        id: string,
        userId: string
    ) {
        const note = await this.repository.findById(id, userId);
        if(!note) {
            throw new NotFoundError("Note not found");
        }
        return note;
    }

    async findAll(options: GetNotesOptions) {
        const result = await this.repository.findAll(options);
        return {
            data: result.notes,
            pagination: {
                page: options.page,
                limit: options.limit,
                total: result.total,
                totalPages: Math.ceil(
                    result.total / options.limit
                )
            }
        }
    }
}