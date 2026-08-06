import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "../src/generated/prisma/client.js";
import bcrypt from "bcrypt";
import { env } from "../src/config/env.js";

const prisma = new PrismaClient({
    adapter: new PrismaPg({
        connectionString: env.DATABASE_URL
    })
})

async function main() {
    await prisma.user.deleteMany();
    const userPassword = await bcrypt.hash("user123",10);
    const adminPassword = await bcrypt.hash("admin123", 10);

    await prisma.user.createMany({
        data: [
            {
                email: "user@example.com",
                passwordHash: userPassword,
                role: Role.USER,
            },
            {
                email: "admin@example.com",
                passwordHash: adminPassword,
                role: Role.ADMIN
            },
        ],
        skipDuplicates: true
    });
    console.log("Users seeded");
}

main()
    .catch(console.error)
    .finally(async ()=>{
        await prisma.$disconnect();
    });
