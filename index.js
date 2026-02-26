import express from 'express';
import notesRouter from './routes/notes.js';
import mongoose from "mongoose";
import { Post } from "./models/index.js";

const app = express();

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

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/halo/:greeting', (req, res) => {
  const { greeting } = req.params;
  res.send(`Hello ${greeting}!`);
});

app.get('/along', (req, res) => {
  res.status(401).send('Tidak bisa akses!');
});

mongoose.connect("mongodb://localhost:27017/myapp");

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

app.use(express.json());

app.use('/notes', notesRouter);

app.use((err, req, res, next) => {
  res.status(500);
  res.json({
    result: 'fail',
    error: err.message,
  });
});

app.use((req, res, next) => {
  res.status(404);
  res.send({
    result: 'fail',
    error: `Page not found ${req.path}`,
  });
});

