import {prisma} from "../lib/prisma.js";
import type {Prisma} from "../generated/prisma/client.js";

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

    async findById(
        id: string,
        userId: string
    ) {
        return prisma.note.findFirst({
            where: {
                id,
                userId,
                deletedAt: null
            }
        });
    }

    async findAll(options: {
        page: number;
        limit: number;
        search?: string;
        favorite?: boolean;
        archived?: boolean;
        sort: "createdAt" | "updatedAt" | "title";
        order: Prisma.SortOrder;
        userId: string;
    }) {
        const {
            page,
            limit,
            search,
            favorite,
            archived,
            sort,
            order,
            userId
        } = options;

        const where: Prisma.NoteWhereInput = {
            userId,
            deletedAt: null
        }

        if(favorite !== undefined) {
            where.favorite = favorite;
        }
        if(archived !== undefined) {
            where.archived = archived;
        }
        if(search) {
            where.OR = [
                {
                    title: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            ];
        }
        const [notes, total] = await prisma.$transaction([
            prisma.note.findMany({
                where,
                skip: (page-1)*limit,
                take: limit,
                orderBy: {
                    [sort]: order
                }
            }),

            prisma.note.count({
                where
            })
        ]);

        return {
            notes,
            total
        };
    }

    async update(
        id: string,
        userId: string,
        data: Prisma.NoteUpdateInput
    ) {
        return prisma.note.updateMany({
            where: {
                id,
                userId,
                deletedAt: null
            },
            data
        });
    }

    async softDelete(
        id: string,
        userId: string
    ) {
        return prisma.note.updateMany({
            where: {
                id,
                userId,
                deletedAt: null,
            },
            data: {
                deletedAt: new Date()
            }
        });
    }

    async restore(
        id: string,
        userId: string
    ) {
        return prisma.note.updateMany({
            where: {
                id,
                userId,
                deletedAt: {
                    not: null
                },
            },
            data: {
                deletedAt: null
            }
        });
    }

    async permanentDelete(
        id: string,
        userId: string
    ) {
        return prisma.note.deleteMany({
            where: {
                id,
                userId,
                deletedAt: {
                    not: null
                }
            }
        });
    }

    async bulkArchive(
        ids: string[],
        userId: string
    ) {
        return prisma.note.updateMany({
            where: {
                id: {
                    in: ids
                },
                userId,
                deletedAt: null
            },
            data: {
                archived: true
            }
        });
    }

    
}
