import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { Post } from "../models/schema.js"; // Pastikan di schema.js kamu sudah melakukan mongoose.model("Post", PostSchema)

const router = Router();

// ================= GET ALL POSTS =================
// Menampilkan post milik user yang sedang login saja
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({}); 
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= GET POST BY ID =================
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
    });

    if (!post) {
      return res.status(404).json({ error: "Post tidak ditemukan" });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= CREATE POST =================
router.post("/", verifyToken, async (req, res) => {
  const { title, content, author } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required",
    });
  }

  try {
    const newPost = await Post.create({
      author,
      title,
      content,
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= UPDATE POST =================
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id},
      {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= DELETE POST =================
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedPost = await Post.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;