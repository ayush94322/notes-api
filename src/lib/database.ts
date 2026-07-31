import {prisma} from "./prisma.js";

export async function connectDatabase() {
    await prisma.$connect();
    console.log("Database connected");
}
export async function disconnectDatabase() {
    await prisma.$disconnect();
    console.log("Database disconnected");
}