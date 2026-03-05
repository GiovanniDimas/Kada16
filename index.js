import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import notesRouter from "./routes/notes.js";
import authRouter from "./routes/auth.js";
import paymentRoutes from "./routes/payment.js";

dotenv.config();

console.log("ENV LOADED:", process.env.MONGO_URI ? "YES" : "NO");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

// ===============================
// CONNECT DATABASE
// ===============================
async function connectDb() {
  if (isConnected) return;

  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  isConnected = true;
  console.log("✅ MongoDB Connected");
}

// middleware connect db
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (err) {
    res.status(500).json({
      error: "Database connection failed",
      message: err.message
    });
  }
});

// ===============================
// CORS
// ===============================
app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

// FIX ERROR path-to-regexp
app.options("/*", cors());

// ===============================
// BODY PARSER
// ===============================
app.use(express.json());

// ===============================
// ROUTES
// ===============================
app.use("/notes", notesRouter);
app.use("/auth", authRouter);
app.use("/payment", paymentRoutes);

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});