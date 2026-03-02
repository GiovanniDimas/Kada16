import express from "express";
import bcrypt from "bcrypt";
import User from "../models/schemas/users.js";

const router = express.Router();

// REGISTER
export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // validasi kosong
    if (!email || !password) {
      return res.status(400).json({
        error: "Email dan password wajib diisi"
      });
    }

    // validasi email
    if (!email.includes("@") || !email.includes(".com")) {
      return res.status(400).json({
        error: "Email harus mengandung @ dan .com"
      });
    }

    // validasi password
    if (password.length < 8) {
      return res.status(400).json({
        error: "Password minimal 8 karakter"
      });
    }

    // cek email
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        error: "This email is already registered"
      });
    }

    // hash password
    const pwHash = await bcrypt.hash(password, 10);

    // simpan user
    await User.create({
      email,
      password: pwHash,
    });

    res.status(201).json({ message: "Register success" });

  } catch (err) {
    next(err);
  }
};

// LOGIN
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // validasi kosong
    if (!email || !password) {
      return res.status(400).json({
        error: "Email dan password wajib diisi"
      });
    }

    // validasi email
    if (!email.includes("@") || !email.includes(".com")) {
      return res.status(400).json({
        error: "Email harus mengandung @ dan .com"
      });
    }

    // validasi password
    if (password.length < 8) {
      return res.status(400).json({
        error: "Password minimal 8 karakter"
      });
    }

    // cek user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "Email tidak terdaftar"
      });
    }

    // cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: "Password salah"
      });
    }

    res.json({
      message: "Login success",
      user: {
        id: user._id,
        email: user.email,
      }
    });

  } catch (err) {
    next(err);
  }
};

router.post("/register", register);
router.post("/login", login);

export default router;