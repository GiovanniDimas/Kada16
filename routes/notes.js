import { Router } from "express";
import Note from "../models/note.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

// ================= GET ALL NOTES =================
router.get("/", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= GET NOTE BY ID =================
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ error: "Catatan tidak ditemukan" });
    }

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= CREATE NOTE =================
router.post("/", verifyToken, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required",
    });
  }

  try {
    const note = await Note.create({
      user: req.user.id,
      title,
      content,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= UPDATE NOTE =================
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        title: req.body.title,
        content: req.body.content,
      },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= DELETE NOTE =================
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;