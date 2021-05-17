const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('user-join-room-post', ({ postId }) => {
    console.log('socket.room', socket.room);
    if (socket.room) {
      socket.leave(socket.room);
    }
    console.log('user-join-room-post', { postId });
    socket.room = postId;
    socket.join(postId);
  });

  socket.on('user-leave-room-post', () => {
    console.log('user-leave-room-post');
    socket.leave(socket.room);
  });

  socket.on('clap-post', ({ postId }) => {
    console.log('clap-post', postId);
    io.sockets.in(postId).emit('clap-post-response');
  });
});

server.listen(4000, () => {
  console.log('listening on *:4000');
});
