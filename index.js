import express from 'express';
import notesRouter from './routes/notes.js';
import mongoose from "mongoose";
import cors from "cors";
import auth from './routes/auth.js';

const cloudURI = "mongodb://giovannidimas32_db_user:McLaren04@cluster0-shard-00-00.zzvssed.mongodb.net:27017,cluster0-shard-00-01.zzvssed.mongodb.net:27017,cluster0-shard-00-02.zzvssed.mongodb.net:27017/?ssl=true&replicaSet=atlas-xxxx&authSource=admin&retryWrites=true&w=majority";

const connectDb = async () => {
  try {
    await mongoose.connect(cloudURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB');
  } catch (e) {
    console.error('❌ MongoDB connection error:', e.message);
    process.exit(1);
  }
};

connectDb();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.use('/notes', notesRouter);  
app.use('/auth', auth);

app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});

export default app;