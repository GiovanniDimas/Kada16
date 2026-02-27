import express from 'express';
import notesRouter from './routes/notes.js';
import mongoose from "mongoose";
import cors from "cors";

// const cloudURI = "mongodb+srv://giovannidimas32_db_user:McLaren04@cluster0.zzvssed.mongodb.net/?appName=Cluster0";
const connectDb = async()=>{
  try{
const cloudURI = "mongodb://giovannidimas32_db_user:McLaren04@ac-r8cngqi-shard-00-00.zzvssed.mongodb.net:27017,ac-r8cngqi-shard-00-01.zzvssed.mongodb.net:27017,ac-r8cngqi-shard-00-02.zzvssed.mongodb.net:27017/notes_db?ssl=true&replicaSet=atlas-yc9v1f-shard-0&authSource=admin&retryWrites=true&w=majority";

await mongoose.connect(cloudURI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));
  }catch(e){
    console.error('error connecting to mongodb',e.message);
    process.exit(1);
  }
}

const app = express();

app.use(express.json());
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
// app.use(express.urlencoded({ extended: true }));
app.use('/notes', notesRouter);  

// app.use((req,res,next) => {
//   console.log(`Request ${req.path}`);
//   next();
// })

// app.use((req,res,next)=> {
//   if(false){
//     next(new Error('Not Authorized'));
//     return;
//   }
//   next();
// }) 

// app.use((err,req,res,next) => {
//   res.send('Error Occured');
// })

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
