const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.use(express.static(`${__dirname}/public`));

io.on('connection', socket => {
  socket.on('user-join-room-post', ({ postId }) => {
    if (socket.room) {
      socket.leave(socket.room);
    }
    socket.room = postId;
    socket.join(postId);
  });

  socket.on('user-leave-room-post', () => {
    socket.leave(socket.room);
  });

  socket.on('clap-post', () => {
    io.sockets.in(socket.room).emit('clap-post-response');
  });

  socket.on('create-comment', ({ comment }) => {
    io.sockets.in(socket.room).emit('create-comment-response', { comment });
  });

  socket.on('user-typing', usernameShow => {
    io.sockets.in(socket.room).emit('user-typing-response', usernameShow);
  });

  socket.on('user-pause-typing', () => {
    io.sockets.in(socket.room).emit('user-pause-typing-response');
  });
});

server.listen(4000, () => {
  console.log('listening on *:4000');
});
