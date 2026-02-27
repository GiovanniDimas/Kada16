import { Router } from "express";
import * as Note from "../models/note.js";
import { Post } from "../models/index.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const notes = await Post.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Post.findById(id);

    if (!note) {
      return res.status(404).json({
        error: "Catatan tidak ditemukan",
        message: `Tidak ada catatan dengan id ${id}`,
      });
    }

    res.status(200).json(note);

  } catch (error) {
    console.error("Error Detail:", error.message);
    res.status(500).json({
      error: "Terjadi kesalahan saat mencari catatan",
      message: error.message,
    });
  }
});

router.post("/", async (req, res, next) => {
  const {author, title, content } = req.body;
  
  if (!author || !title || !content) {
    return res.status(400).json({
      message: "Author, title, and content are required",
    })
  }
    
  try {
  const note = await Post.create({

    author: author,
    title: title,
    content: content,
  });

  res.status(201).json(note);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", (req, res, next) => {
  const id = Number(req.params.id);
  const { author, title, content } = req.body;

  try {
    const note = Note.update(id, author, title, content);
    res.json(note);
  } catch (e) {
    next(e);
  }
}); 

router.put("/:id", async (req, res, next) => {
  
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const updatedNote = await Post.findByIdAndUpdate(id, { author, title, content }, { new: true });
        if (!updatedNote) {
            return res.status(404).json({ error: "Note not found" });
        }
        res.json(updatedNote);
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", (req, res, next) => {
  const id = Number(req.params.id);

  try {
    Note.remove(id);
    res.json({ result: "success" });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
    const { id } = req.params;
    try {
        const note = await Post.findByIdAndDelete(id);

        if (!note) return res.status(404).json({ message: "Note not found" });

        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;