import dotenv from 'dotenv';
dotenv.config();

console.log("ENV LOADED:", process.env.MONGO_URI ? "YES" : "NO");

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import notesRouter from './routes/notes.js';
import authRouter from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

async function connectDb() {
  if (isConnected) return;

  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  isConnected = true;
  console.log("✅ MongoDB Connected");
}

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

app.use(express.json());
app.use(cors());

app.use('/notes', notesRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});