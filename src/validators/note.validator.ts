import {z} from "zod";

export const createNoteSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1)
        .max(200),
    content: z
        .string()
        .trim()
        .min(1),
});

export const getNotesSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(100),
    search: z.string().trim().optional(),
    favorite: z.coerce.boolean().optional(),
    archived: z.coerce.boolean().optional(),
    sort: z
        .enum([
            "createdAt",
            "updatedAt",
            "title"
        ])
        .default("createdAt"),
    order: z
        .enum([
            "asc",
            "desc"
        ])
        .default("desc")
});

export const noteIdSchema = z.object({
    id: z.string().cuid(),
});

export const updateNoteSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1)
        .max(200)
        .optional(),
    content: z
        .string()
        .trim()
        .min(1)
        .optional(),
    favorites: z.boolean().optional(),
    archived: z.boolean().optional()
}).refine((data)=> Object.keys(data).length > 0,
    {
        message: "At least one field is required"
    }
)

export const bulkNotesSchema = z.object({
    ids: z
        .array(z.string().cuid())
        .min(1)
        .max(100)
});