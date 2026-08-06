import express from "express";
import noteRoutes from "./routes/note.route.js";
import authRoutes from "./routes/auth.route.js";
const app = express();

app.use(express.json());

app.use("/notes", noteRoutes);
app.use("/auth", authRoutes);
app.get("/health", (req, res)=>{
    res.status(200).json({
        success: true,
        message: "Notes API is running"
    });
});


export default app;