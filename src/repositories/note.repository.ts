import {prisma} from "../lib/prisma.js";

export class NoteRepository {
    async create(data: {
        title: string;
        content: string;
        userId: string;
    }) {
        return prisma.note.create({
            data
        });
    }
}