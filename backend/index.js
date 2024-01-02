import express from 'express';
import cors from 'cors';
import http from 'http';

import connectToMongo from './db.js';
import { configureSocket } from './socket.js';

import auth from './api/auth.js';
import post from './api/post.js';
import comment from './api/comment.js';
import chat from './api/chat.js';
import message from './api/message.js';
import community from './api/community.js';

const app = express();
const server = http.createServer(app);
const port = 5000;

connectToMongo();

//Middlewares
app.use(express.json());
app.use(cors());

//Available routes
app.use('/api/auth', auth);
app.use('/api/post', post);
app.use('/api/comment', comment);
app.use('/api/chat', chat);
app.use('/api/message', message);
app.use('/api/community', community);

const io = configureSocket(server);


server.listen(port, () => {
    console.log(`Reddit app listening on http://localhost:${port}`);
})

export default io;