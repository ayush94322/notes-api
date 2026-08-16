import {
    describe,
    it,
    expect,
    beforeEach,
    vi,
} from "vitest";

import { NoteRepository } from "../../../src/repositories/note.repository.js";

const { prismaMock } = vi.hoisted(() => ({
    prismaMock: {
        note: {
            create: vi.fn(),
            findFirst: vi.fn(),
            findMany: vi.fn(),
            count: vi.fn(),
            updateMany: vi.fn(),
            deleteMany: vi.fn(),
        },

        noteDeletion: {
            createMany: vi.fn(),
        },

        $transaction: vi.fn(),
        $queryRaw: vi.fn(),
    },
}));

vi.mock("../../../src/lib/prisma.js", () => ({
    prisma: prismaMock,
}));


const repository = new NoteRepository();

beforeEach(() => {
    vi.clearAllMocks();
});

describe("NoteRepository.create", () => {

    it("should create a note", async () => {
        const data = {
            title: "My Note",
            content: "Hello World",
            userId: "user-1",
        };

        const createdNote = {
            id: "note-1",
            ...data,
        };

        prismaMock.note.create
            .mockResolvedValue(createdNote);

        const result =
            await repository.create(data);

        expect(result).toEqual(createdNote);

        expect(prismaMock.note.create)
            .toHaveBeenCalledWith({
                data,
            });
    });

});

describe("NoteRepository.findById", () => {

    it("should find an active note belonging to the user", async () => {
        const note = {
            id: "note-1",
            title: "My Note",
            content: "Hello",
            userId: "user-1",
            deletedAt: null,
        };

        prismaMock.note.findFirst
            .mockResolvedValue(note);

        const result =
            await repository.findById(
                "note-1",
                "user-1"
            );

        expect(result).toEqual(note);

        expect(prismaMock.note.findFirst)
            .toHaveBeenCalledWith({
                where: {
                    id: "note-1",
                    userId: "user-1",
                    deletedAt: null,
                },
            });
    });
    it("should return null when note does not exist", async () => {
        prismaMock.note.findFirst
            .mockResolvedValue(null);

        const result =
            await repository.findById(
                "note-1",
                "user-1"
            );

        expect(result).toBeNull();
    });
});

describe("NoteRepository.update", () => {

    it("should update an active note belonging to the user", async () => {
        const data = {
            title: "Updated title",
        };

        const resultData = {
            count: 1,
        };

        prismaMock.note.updateMany
            .mockResolvedValue(resultData);

        const result =
            await repository.update(
                "note-1",
                "user-1",
                data
            );

        expect(result).toEqual(resultData);

        expect(prismaMock.note.updateMany)
            .toHaveBeenCalledWith({
                where: {
                    id: "note-1",
                    userId: "user-1",
                    deletedAt: null,
                },
                data,
            });
    });

});

describe("NoteRepository.softDelete", () => {

    it("should soft delete an active note", async () => {
        const resultData = {
            count: 1,
        };

        prismaMock.note.updateMany
            .mockResolvedValue(resultData);

        const result =
            await repository.softDelete(
                "note-1",
                "user-1"
            );

        expect(result).toEqual(resultData);

        expect(prismaMock.note.updateMany)
            .toHaveBeenCalledWith({
                where: {
                    id: "note-1",
                    userId: "user-1",
                    deletedAt: null,
                },
                data: {
                    deletedAt: expect.any(Date),
                },
            });
    });

});

describe("NoteRepository.restore", () => {

    it("should restore a deleted note", async () => {
        const resultData = {
            count: 1,
        };

        prismaMock.note.updateMany
            .mockResolvedValue(resultData);

        const result =
            await repository.restore(
                "note-1",
                "user-1"
            );

        expect(result).toEqual(resultData);

        expect(prismaMock.note.updateMany)
            .toHaveBeenCalledWith({
                where: {
                    id: "note-1",
                    userId: "user-1",
                    deletedAt: {
                        not: null,
                    },
                },
                data: {
                    deletedAt: null,
                },
            });
    });

});

describe("NoteRepository.permanentDelete", () => {

    it("should permanently delete a soft-deleted note", async () => {
        const resultData = {
            count: 1,
        };

        prismaMock.note.deleteMany
            .mockResolvedValue(resultData);

        const result =
            await repository.permanentDelete(
                "note-1",
                "user-1"
            );

        expect(result).toEqual(resultData);

        expect(prismaMock.note.deleteMany)
            .toHaveBeenCalledWith({
                where: {
                    id: "note-1",
                    userId: "user-1",
                    deletedAt: {
                        not: null,
                    },
                },
            });
    });

});

describe("NoteRepository.bulkArchive", () => {

    it("should archive multiple active notes", async () => {
        const ids = [
            "note-1",
            "note-2",
            "note-3",
        ];

        const resultData = {
            count: 3,
        };

        prismaMock.note.updateMany
            .mockResolvedValue(resultData);

        const result =
            await repository.bulkArchive(
                ids,
                "user-1"
            );

        expect(result).toEqual(resultData);

        expect(prismaMock.note.updateMany)
            .toHaveBeenCalledWith({
                where: {
                    id: {
                        in: ids,
                    },
                    userId: "user-1",
                    deletedAt: null,
                },
                data: {
                    archived: true,
                },
            });
    });

});

describe("NoteRepository.bulkFavorite", () => {

    it("should favorite multiple active notes", async () => {
        const ids = [
            "note-1",
            "note-2",
        ];

        const resultData = {
            count: 2,
        };

        prismaMock.note.updateMany
            .mockResolvedValue(resultData);

        const result =
            await repository.bulkFavorite(
                ids,
                "user-1"
            );

        expect(result).toEqual(resultData);

        expect(prismaMock.note.updateMany)
            .toHaveBeenCalledWith({
                where: {
                    id: {
                        in: ids,
                    },
                    userId: "user-1",
                    deletedAt: null,
                },
                data: {
                    favorite: true,
                },
            });
    });

});

describe("NoteRepository.bulkRestore", () => {

    it("should restore multiple deleted notes", async () => {
        const ids = [
            "note-1",
            "note-2",
        ];

        const resultData = {
            count: 2,
        };

        prismaMock.note.updateMany
            .mockResolvedValue(resultData);

        const result =
            await repository.bulkRestore(
                ids,
                "user-1"
            );

        expect(result).toEqual(resultData);

        expect(prismaMock.note.updateMany)
            .toHaveBeenCalledWith({
                where: {
                    id: {
                        in: ids,
                    },
                    userId: "user-1",
                    deletedAt: {
                        not: null,
                    },
                },
                data: {
                    deletedAt: null,
                },
            });
    });

});

describe("NoteRepository.findAll", () => {

    it("should return paginated notes without search", async () => {
        const notes = [
            {
                id: "note-1",
                title: "Note 1",
                content: "Hello",
                userId: "user-1",
                deletedAt: null,
            },
        ];

        prismaMock.note.findMany
            .mockResolvedValue(notes);

        prismaMock.note.count
            .mockResolvedValue(1);

        prismaMock.$transaction
            .mockResolvedValue([
                notes,
                1,
            ]);

        const result =
            await repository.findAll({
                page: 1,
                limit: 10,
                sort: "createdAt",
                order: "desc",
                userId: "user-1",
            });

        expect(result).toEqual({
            notes,
            total: 1,
        });
    });
    it("should apply pagination", async () => {
        prismaMock.note.findMany
            .mockResolvedValue([]);

        prismaMock.note.count
            .mockResolvedValue(25);

        prismaMock.$transaction
            .mockResolvedValue([
                [],
                25,
            ]);

        await repository.findAll({
            page: 3,
            limit: 10,
            sort: "createdAt",
            order: "desc",
            userId: "user-1",
        });

        expect(prismaMock.note.findMany)
            .toHaveBeenCalledWith({
                where: {
                    userId: "user-1",
                    deletedAt: null,
                },
                skip: 20,
                take: 10,
                orderBy: {
                    createdAt: "desc",
                },
            });
    });
    it("should filter by favorite and archived", async () => {
        prismaMock.note.findMany
            .mockResolvedValue([]);

        prismaMock.note.count
            .mockResolvedValue(0);

        prismaMock.$transaction
            .mockResolvedValue([
                [],
                0,
            ]);

        await repository.findAll({
            page: 1,
            limit: 10,
            favorite: true,
            archived: false,
            sort: "createdAt",
            order: "desc",
            userId: "user-1",
        });

        expect(prismaMock.note.findMany)
            .toHaveBeenCalledWith({
                where: {
                    userId: "user-1",
                    deletedAt: null,
                    favorite: true,
                    archived: false,
                },
                skip: 0,
                take: 10,
                orderBy: {
                    createdAt: "desc",
                },
            });
    });
    it("should apply sorting", async () => {
        prismaMock.note.findMany
            .mockResolvedValue([]);

        prismaMock.note.count
            .mockResolvedValue(0);

        prismaMock.$transaction
            .mockResolvedValue([
                [],
                0,
            ]);

        await repository.findAll({
            page: 1,
            limit: 10,
            sort: "title",
            order: "asc",
            userId: "user-1",
        });

        expect(prismaMock.note.findMany)
            .toHaveBeenCalledWith({
                where: {
                    userId: "user-1",
                    deletedAt: null,
                },
                skip: 0,
                take: 10,
                orderBy: {
                    title: "asc",
                },
            });
    });
    it("should search notes using full-text search", async () => {
        const notes = [
            {
                id: "note-1",
                title: "Database",
                content: "PostgreSQL notes",
                userId: "user-1",
            },
        ];

        prismaMock.$queryRaw
            .mockResolvedValueOnce(notes)
            .mockResolvedValueOnce([
                { count: BigInt(1) },
            ]);

        prismaMock.$transaction
            .mockResolvedValue([
                notes,
                [{ count: BigInt(1) }],
            ]);

        const result =
            await repository.findAll({
                page: 1,
                limit: 10,
                search: "database",
                sort: "createdAt",
                order: "desc",
                userId: "user-1",
            });

        expect(result).toEqual({
            notes,
            total: 1,
        });

        expect(prismaMock.$queryRaw)
            .toHaveBeenCalledTimes(2);

        expect(prismaMock.$transaction)
            .toHaveBeenCalledTimes(1);
    });
});

describe("NoteRepository.getStats", () => {

    it("should return note statistics", async () => {

        prismaMock.note.count
            .mockResolvedValueOnce(10)
            .mockResolvedValueOnce(7)
            .mockResolvedValueOnce(3)
            .mockResolvedValueOnce(2)
            .mockResolvedValueOnce(4);

        prismaMock.$transaction
            .mockResolvedValue([
                10,
                7,
                3,
                2,
                4,
            ]);

        const result =
            await repository.getStats(
                "user-1"
            );

        expect(result).toEqual({
            total: 10,
            active: 7,
            deleted: 3,
            favorites: 2,
            archived: 4,
        });

        expect(prismaMock.note.count)
            .toHaveBeenCalledTimes(5);

        expect(prismaMock.$transaction)
            .toHaveBeenCalledTimes(1);
    });

});

describe("NoteRepository.bulkDelete", () => {

    it("should bulk delete active notes", async () => {

        const ids = [
            "note-1",
            "note-2",
        ];

        const txMock = {
            note: {
                findMany: vi.fn()
                    .mockResolvedValue([
                        { id: "note-1" },
                        { id: "note-2" },
                    ]),

                updateMany: vi.fn()
                    .mockResolvedValue({
                        count: 2,
                    }),
            },

            noteDeletion: {
                createMany: vi.fn()
                    .mockResolvedValue({
                        count: 2,
                    }),
            },
        };

        prismaMock.$transaction
            .mockImplementation(
                async (callback) => {
                    return callback(txMock);
                }
            );

        const result =
            await repository.bulkDelete(
                ids,
                "user-1"
            );

        expect(result).toEqual({
            deleted: 2,
        });

        expect(txMock.note.findMany)
            .toHaveBeenCalledWith({
                where: {
                    id: {
                        in: ids,
                    },
                    userId: "user-1",
                    deletedAt: null,
                },
                select: {
                    id: true,
                },
            });

        expect(txMock.noteDeletion.createMany)
            .toHaveBeenCalledWith({
                data: [
                    {
                        noteId: "note-1",
                        userId: "user-1",
                    },
                    {
                        noteId: "note-2",
                        userId: "user-1",
                    },
                ],
            });

        expect(txMock.note.updateMany)
            .toHaveBeenCalledWith({
                where: {
                    id: {
                        in: [
                            "note-1",
                            "note-2",
                        ],
                    },
                    userId: "user-1",
                    deletedAt: null,
                },
                data: {
                    deletedAt: expect.any(Date),
                },
            });
    });
    it("should return zero when no active notes are found", async () => {

        const txMock = {
            note: {
                findMany: vi.fn()
                    .mockResolvedValue([]),

                updateMany: vi.fn(),
            },

            noteDeletion: {
                createMany: vi.fn(),
            },
        };

        prismaMock.$transaction
            .mockImplementation(
                async (callback) => {
                    return callback(txMock);
                }
            );

        const result =
            await repository.bulkDelete(
                ["note-1"],
                "user-1"
            );

        expect(result).toEqual({
            deleted: 0,
        });

        expect(txMock.noteDeletion.createMany)
            .not.toHaveBeenCalled();

        expect(txMock.note.updateMany)
            .not.toHaveBeenCalled();
    });
});
