import express from 'express';

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

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});