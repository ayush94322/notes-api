import "dotenv/config";
import { defineConfig } from "prisma/config";
import {z} from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url()
});
const parsed = envSchema.safeParse(process.env);
if(!parsed.success) {
  console.error(z.flattenError(parsed.error).fieldErrors);
  process.exit(1);
}
const env = parsed.data;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env.DATABASE_URL,
  },
});
