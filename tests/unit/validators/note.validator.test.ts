import {
    describe,
    it,
    expect,
} from "vitest";

import {
    createNoteSchema,
    updateNoteSchema,
    getNotesSchema,
    noteIdSchema,
    bulkNotesSchema,
} from "../../../src/validators/note.validator.js";


describe("createNoteSchema", () => {

    it("should accept valid note data", () => {
        const result =
            createNoteSchema.safeParse({
                title: "My Note",
                content: "Hello",
            });

        expect(result.success).toBe(true);
    });

    it("should reject missing title", () => {
        const result =
            createNoteSchema.safeParse({
                content: "Hello",
            });

        expect(result.success).toBe(false);
    });


    it("should reject missing content", () => {
        const result =
            createNoteSchema.safeParse({
                title: "My Note",
            });

        expect(result.success).toBe(false);
    });


    it("should reject empty title", () => {
        const result =
            createNoteSchema.safeParse({
                title: "",
                content: "Hello",
            });

        expect(result.success).toBe(false);
    });


    it("should reject whitespace-only title", () => {
        const result =
            createNoteSchema.safeParse({
                title: "   ",
                content: "Hello",
            });

        expect(result.success).toBe(false);
    });


    it("should reject non-string title", () => {
        const result =
            createNoteSchema.safeParse({
                title: 123,
                content: "Hello",
            });

        expect(result.success).toBe(false);
    });


    it("should reject title longer than 200 characters", () => {
        const result =
            createNoteSchema.safeParse({
                title: "a".repeat(201),
                content: "Hello",
            });

        expect(result.success).toBe(false);
    });


    it("should trim title and content", () => {
        const result =
            createNoteSchema.safeParse({
                title: "  My Note  ",
                content: "  Hello  ",
            });

        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data.title).toBe("My Note");
            expect(result.data.content).toBe("Hello");
        }
    });

});

describe("getNotesSchema", () => {

    it("should accept valid query", () => {
        const result =
            getNotesSchema.safeParse({
                search: "database",
                page: "1",
                limit: "10",
                favorite: "true",
                archived: "false",
                sort: "createdAt",
                order: "desc",
            });

        expect(result.success).toBe(true);
    });


    it("should reject page 0", () => {
        const result =
            getNotesSchema.safeParse({
                page: "0",
            });

        expect(result.success).toBe(false);
    });


    it("should reject negative page", () => {
        const result =
            getNotesSchema.safeParse({
                page: "-1",
            });

        expect(result.success).toBe(false);
    });


    it("should reject limit 0", () => {
        const result =
            getNotesSchema.safeParse({
                limit: "0",
            });

        expect(result.success).toBe(false);
    });


    it("should reject limit greater than 100", () => {
        const result =
            getNotesSchema.safeParse({
                limit: "101",
            });

        expect(result.success).toBe(false);
    });


    it("should accept limit 100", () => {
        const result =
            getNotesSchema.safeParse({
                limit: "100",
            });

        expect(result.success).toBe(true);
    });


    it("should accept favorite filter", () => {
        const result =
            getNotesSchema.safeParse({
                favorite: "true",
            });

        expect(result.success).toBe(true);
    });


    it("should accept archived filter", () => {
        const result =
            getNotesSchema.safeParse({
                archived: "false",
            });

        expect(result.success).toBe(true);
    });


    it("should reject invalid sort", () => {
        const result =
            getNotesSchema.safeParse({
                sort: "password",
            });

        expect(result.success).toBe(false);
    });


    it("should reject invalid order", () => {
        const result =
            getNotesSchema.safeParse({
                order: "random",
            });

        expect(result.success).toBe(false);
    });

});

describe("bulkNotesSchema", () => {

    const validId =
        "cm123456789012345678901234";

    it("should accept valid ids", () => {
        const result =
            bulkNotesSchema.safeParse({
                ids: [
                    validId,
                    validId,
                ],
            });

        expect(result.success).toBe(true);
    });


    it("should reject empty ids array", () => {
        const result =
            bulkNotesSchema.safeParse({
                ids: [],
            });

        expect(result.success).toBe(false);
    });


    it("should reject more than 100 ids", () => {
        const ids = Array(101).fill(validId);

        const result =
            bulkNotesSchema.safeParse({
                ids,
            });

        expect(result.success).toBe(false);
    });


    it("should reject invalid note id", () => {
        const result =
            bulkNotesSchema.safeParse({
                ids: ["note-1"],
            });

        expect(result.success).toBe(false);
    });


    it("should reject non-array ids", () => {
        const result =
            bulkNotesSchema.safeParse({
                ids: validId,
            });

        expect(result.success).toBe(false);
    });

});