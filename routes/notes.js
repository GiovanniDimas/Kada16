import { Router } from "express";
import * as Note from "../models/note.js";
import { Post } from "../models/index.js";

const router = Router();

router.get("/", (req, res, next) => {
  const notes = Note.list();
  res.json(notes);
});

router.post("/", async (req, res, next) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required",
    })
  }
    
  try {
  //const note = Note.create(title, content);
  const note = await Post.create({
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
  const { title, content } = req.body;

  try {
    const note = Note.update(id, title, content);
    res.json(note);
  } catch (e) {
    next(e);
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


export default router;