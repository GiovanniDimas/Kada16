import express from 'express';
import notesRouter from './routes/notes.js';
import mongoose from "mongoose";
import { Post } from "./models/index.js";
import cors from "cors";

const cloudURI = "mongodb+srv://giovannidimas32_db_user:McLaren04@cluster0.zzvssed.mongodb.net/?appName=Cluster0";

mongoose.connect(cloudURI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

const app = express();

app.use(express.json());
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.urlencoded({ extended: true }));
app.use('/notes', notesRouter);  

app.use((req,res,next) => {
  console.log(`Request ${req.path}`);
  next();
})

app.use((req,res,next)=> {
  if(false){
    next(new Error('Not Authorized'));
    return;
  }
  next();
}) 

app.use((err,req,res,next) => {
  res.send('Error Occured');
})

// app.get('/', (req, res) => {
//   res.send('Hello Dimas!');
// });

// app.get('/halo/:greeting', (req, res) => {
//   const { greeting } = req.params;
//   res.send(`Hello ${greeting}!`);
// });

// app.get('/along', (req, res) => {
//   res.status(401).send('Tidak bisa akses!');
// });

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
