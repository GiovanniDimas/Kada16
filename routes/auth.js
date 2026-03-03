import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/schemas/users.js";

const router = express.Router();

// ================= REGISTER =================
export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email dan password wajib diisi"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password minimal 8 karakter"
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        error: "This email is already registered"
      });
    }

    const pwHash = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: pwHash,
    });

    res.status(201).json({ message: "Register success" });

  } catch (err) {
    next(err);
  }
};

// ================= LOGIN =================
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email dan password wajib diisi"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "Email tidak terdaftar"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: "Password salah"
      });
    }

    //  GENERATE TOKEN
    console.log("Secret Key Login:", process.env.JWT_SECRET);
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login success",
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (err) {
    next(err);
  }
};

router.post("/register", register);
router.post("/login", login);

export default router;