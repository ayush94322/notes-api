import { NotFoundError } from "../errors/NotFoundError.js";
import { Prisma } from "../generated/prisma/client.js";
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

    async update(
        id: string,
        userId: string,
        data: Prisma.NoteUpdateInput
    ) {
        const result = await this.repository.update(
            id,
            userId,
            data
        );
        if(result.count === 0) {
            throw new NotFoundError("Note not found");
        }
        return this.repository.findById(id, userId);
    }

    async softDelete(
        id: string,
        userId: string
    ) {
        const result = await this.repository.softDelete(
            id,
            userId
        );
        if(result.count === 0) {
            throw new NotFoundError("Note Not Found");
        }
    }

    async restore(
        id: string,
        userId: string
    ) {
        const result = await this.repository.restore(
            id,
            userId
        );
        if(result.count === 0) {
            throw new NotFoundError("Note Not Found");
        }
        return this.repository.findById(id, userId);
    }

    async permanentDelete(
        id: string,
        userId: string
    ) {
        const result = await this.repository.permanentDelete(
            id,
            userId
        );
        if(result.count === 0) {
            throw new NotFoundError("Note Not Found or Deleted");
        }
    }

    async bulkDelete(
        ids: string[],
        userId: string
    ) {
        return this.repository.bulkDelete(
            ids,
            userId
        );
    }

    async bulkFavorite(
        ids: string[],
        userId: string
    ) {
        return this.repository.bulkFavourite(
            ids,
            userId
        );
    }

    async bulkRestore(
        ids: string[],
        userId: string
    ) {
        return this.repository.bulkRestore(
            ids,
            userId
        );
    }

    async bulkArchive(
        ids: string[],
        userId: string
    ) {
        return this.repository.bulkArchive(
            ids,
            userId
        );
    }

    async getStats(userId: string) {
        return this.repository.getStats(userId);
    }
}