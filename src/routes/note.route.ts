import { Router } from "express";
import { NoteController } from "../controllers/note.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { createNoteSchema, getNotesSchema } from "../validators/note.validator.js";

const router = Router();

const controller = new NoteController();

router.post("/", authenticate, validate(createNoteSchema), controller.create.bind(controller));
router.get("/", authenticate, validate(getNotesSchema, "query"), controller.findAll.bind(controller));

export default router;