import express from 'express';
import connectToMongo from './db.js';
import cors from 'cors';
import auth from './api/auth.js';
import post from './api/post.js';
import comment from './api/comment.js';

const app = express();
const port = 5000;

connectToMongo();

//Middlewares
app.use(express.json());
app.use(cors());

//Available routes
app.use('/api/auth', auth);
app.use('/api/post', post);
app.use('/api/comment', comment);


app.listen(port, () => {
    console.log(`reddit app listening on  http://localhost:${port}`);
})