import express, { json } from 'express';
import dotenv from 'dotenv';
dotenv.config()
import cors from 'cors';

import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import checkAuth from './routes/checkAuth.js'
import verify from './routes/verify.js'
import postRoutes from './routes/post.js';
import authorRoutes from './routes/author.js';
import profileRoutes from './routes/Profile.js';
import commentRoutes from './routes/comments.js';
import QuestionRoutes from './routes/questions.js';
import AnswersRoutes from './routes/answers.js';

import morgan from 'morgan';
import { Server } from 'socket.io';
import http from 'http';
const app = express();

app.use(json());
app.use(cors(
    {
        origin:"*",
    }
));
const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin:"https://intellilearn-react.onrender.com", methods: ["GET", "POST"]},
});
app.use(morgan("dev"))

app.use("/api/register", userRoutes);
app.use("/api/login", authRoutes);
app.use('/api/check-auth',checkAuth);
app.use('/api/verification',verify)

app.use("/api",postRoutes);
app.use("/api",authorRoutes);
app.use("/api",profileRoutes);

app.use("/api",commentRoutes);
app.use("/api",QuestionRoutes);
app.use("/api",AnswersRoutes);



io.on("connection", (socket) => {
    socket.on("send_message", (data) => {
      socket.broadcast.emit("receive_message", data);
    });
  });


const PORT = process.env.PORT||8080;

server.listen(PORT,()=>{
    console.log(`Listening on PORT ${PORT}`);
})