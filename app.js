import express from 'express';
import notesRouter from './routes/notes.js';

const app = express();

app.use('/notes', notesRouter);

app.listen(3000, () => {
    console.log('Server jalan di http://localhost:3000');
});