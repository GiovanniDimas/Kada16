import express from 'express';
import notesRouter from './routes/notes.js';
import mongoose from "mongoose";
import cors from "cors";
import auth from './routes/auth.js';

const cloudURI = "mongodb+srv://giovannidimas32_db_user:McLaren04@cluster0.zzvssed.mongodb.net/?appName=Cluster0";
const connectDb = async()=>{
  try{

await mongoose.connect(cloudURI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));
  }catch(e){
    console.error('error connecting to mongodb',e.message);
    process.exit(1);
  }
}

connectDb();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));

app.use('/notes', notesRouter);  
app.use('/auth', auth);

app.use((err, req, res, next) => {
  console.log('Error:', err.message);
  res.status(500).send('Error Occurred');
});

app.use((req, res, next) => {
  res.status(404);
  res.send({
    result: 'fail',
    error: `Page not found ${req.path}`,
  });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

export default app;