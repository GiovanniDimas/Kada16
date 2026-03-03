import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers['Authorization'];
  console.log("Received Authorization header:", authHeader); // Debugging log

  // 1. Cek apakah header ada dan dimulai dengan 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token tidak ada atau format salah" });
  }

  // 2. Ambil token setelah spasi
  const token = authHeader.split(" ")[1];
  console.log("Extracted token:", token); // Debugging log

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // 403 Forbidden jika token expired atau salah signature
    return res.status(403).json({ error: err.message });
  }
};