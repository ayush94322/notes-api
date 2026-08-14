import { Router } from "express";
import { NoteController } from "../controllers/note.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { bulkNotesSchema, createNoteSchema, getNotesSchema, noteIdSchema, updateNoteSchema } from "../validators/note.validator.js";

const router = Router();

const controller = new NoteController();

router.get("/stats", authenticate, controller.getStats.bind(controller));
//bulk op routes
router.patch("/bulk/archive", authenticate, validate(bulkNotesSchema), controller.bulkArchive.bind(controller));
router.patch("/bulk/restore", authenticate, validate(bulkNotesSchema), controller.bulkRestore.bind(controller));
router.patch("/bulk/favorite", authenticate, validate(bulkNotesSchema), controller.bulkFavorite.bind(controller));
router.patch("/bulk/delete", authenticate, validate(bulkNotesSchema), controller.bulkDelete.bind(controller));
//specific op routes
router.get("/:id", authenticate, validate(noteIdSchema, "params"), controller.findById.bind(controller));
router.patch("/:id", authenticate, validate(noteIdSchema, "params"), validate(updateNoteSchema), controller.update.bind(controller));
router.delete("/:id", authenticate, validate(noteIdSchema, "params"), controller.delete.bind(controller));
router.patch("/:id/restore", authenticate, validate(noteIdSchema, "params"), controller.restore.bind(controller));
router.delete("/:id/permanent", authenticate, validate(noteIdSchema, "params"), controller.permanentDelete.bind(controller));
//get all route
router.get("/", authenticate, validate(getNotesSchema, "query"), controller.findAll.bind(controller));
//create route
router.post("/", authenticate, validate(createNoteSchema), controller.create.bind(controller));

export default router;