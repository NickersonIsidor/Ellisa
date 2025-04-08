import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import * as http from 'http';

import answerController from './controllers/answer.controller';
import questionController from './controllers/question.controller';
import tagController from './controllers/tag.controller';
import commentController from './controllers/comment.controller';
import { FakeSOSocket } from './types/types';
import userController from './controllers/user.controller';
import messageController from './controllers/message.controller';
import chatController from './controllers/chat.controller';
import gameController from './controllers/game.controller';

dotenv.config();

const MONGO_URL = `${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'}/fake_so`;
const CLIENT_URLS = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'https://cs4530-s25-419.onrender.com','https://accounts.google.com'
  
];
const port = parseInt(process.env.PORT || '8000');

const app = express();
const server = http.createServer(app);
const socket: FakeSOSocket = new Server(server, {
  cors: { origin: '*' },
});

function connectDatabase() {
  return mongoose.connect(MONGO_URL).catch(err => console.log('MongoDB connection error: ', err));
}

function startServer() {
  connectDatabase();



  app._router.stack.forEach((r: any) => {
    if (r.route && r.route.path) {
      console.log('✅ Registered Route:', r.route.path);
    }
  });

  
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

socket.on('connection', socket => {
  console.log('A user connected ->', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

process.on('SIGINT', async () => {
  await mongoose.disconnect();
  socket.close();

  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

app.use(cors({
  credentials: true,
  origin: CLIENT_URLS,
}));

app.use(express.json());

app.get('/', (_: Request, res: Response) => {
  res.send('hello world');
  res.end();
});

app.use('/question', questionController(socket));
app.use('/tag', tagController());
app.use('/answer', answerController(socket));
app.use('/comment', commentController(socket));
app.use('/messaging', messageController(socket));
app.use('/user', userController(socket));
app.use('/chat', chatController(socket));
app.use('/games', gameController(socket));

// Export the app instance
export { app, server, startServer };
