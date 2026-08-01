import { NoteRepository } from "../repositories/note.repository.js";

export class NoteService {
    constructor(
        private repository = new NoteRepository()
    ){}

    async create(
        title: string,
        content: string,
        userId: string
    ) {
        return this.repository.create({
            title,
            content,
            userId
        });
    }
}