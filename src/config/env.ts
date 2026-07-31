import "dotenv/config";
import {z} from "zod";

const schema = z.object({
    PORT: z.coerce.number().int().positive(),
    DATABASE_URL: z.string().min(1),
    JWT_ACCESS_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),
    NODE_ENV: z.enum([
        "development",
        "production",
        "test"
    ])
});

const parsed = schema.safeParse(process.env);

if(!parsed.success) {
    console.error(z.flattenError(parsed.error).fieldErrors);
    process.exit(1);
}

export const env = parsed.data;