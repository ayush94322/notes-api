import app from "./app.js";
import {env} from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./lib/database.js";

async function bootstrap() {
    try {
        await connectDatabase();
        const server = app.listen(env.PORT, ()=>{
            console.log(`Server running on port ${env.PORT}`);
        });
        const shutdown = async ()=>{
            console.log("Shutting sown...");
            server.close(async ()=>{
                await disconnectDatabase();
                process.exit(0);
            });
        }
        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}
bootstrap();