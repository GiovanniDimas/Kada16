import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const form = document.getElementById("registerForm");
const router = express.Router();

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = form.email.value;
  const password = form.password.value;
  const confirm = form.confirm.value;

  // Validasi email
  if (!email.includes("@") || !email.includes(".com")) {
    alert("Email harus mengandung @ dan .com");
    return;
  }

  // Validasi password
  if (password.length < 8) {
    alert("Password minimal 8 karakter");
    return;
  }

  // Validasi confirm password
  if (password !== confirm) {
    alert("Password tidak sama");
    return;
  }

  alert("Registrasi berhasil!");
}); 

router.post("/join", async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    // cek email
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        error: "This email is already registered"
      });
    }

    // hash password
    const saltRounds = 10;
    const pwHash = await bcrypt.hash(password, saltRounds);

    // simpan user
    await User.create({
      email,
      name,
      password: pwHash,
      confirm: pwHash,
    });
    
    res.json({ message: "Register success" });

  } catch (err) {
    next(err);
  }
});

export default router;