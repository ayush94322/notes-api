import express from "express";
import helmet from "helmet";

import noteRoutes from "./routes/note.route.js";
import authRoutes from "./routes/auth.route.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { NotFoundError } from "./errors/NotFoundError.js";

const app = express();

//Middleware
app.use(helmet());
app.use(express.json());

//Routing
app.use("/notes", noteRoutes);
app.use("/auth", authRoutes);
app.get("/health", (_req, res)=>{
    res.status(200).json({
        success: true,
        message: "Notes API is running"
    });
});

// Error handler
app.use(()=>{
    throw new NotFoundError("Route Not Found");
});
app.use(errorHandler);

export default app;