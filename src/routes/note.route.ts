import { Router } from "express";
import { NoteController } from "../controllers/note.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { createNoteSchema, getNotesSchema, noteIdSchema } from "../validators/note.validator.js";

const router = Router();

const controller = new NoteController();

router.get("/:id", authenticate, validate(noteIdSchema, "params"), controller.findById.bind(controller));
router.get("/", authenticate, validate(getNotesSchema, "query"), controller.findAll.bind(controller));
router.post("/", authenticate, validate(createNoteSchema), controller.create.bind(controller));

export default router;