import express from "express";
import noteRoutes from "./routes/note.routes.js";

const app = express();

app.use(express.json());

app.use("/notes", noteRoutes);
app.get("/health", (req, res)=>{
    res.status(200).json({
        success: true,
        message: "Notes API is running"
    });
});

export default app;