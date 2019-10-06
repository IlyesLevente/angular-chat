const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const messages = []; // az osszes uzenet
const users = {}; // felhasznalok
var userNumber = 0; // hanyan vannak

// objektum merete
Object.size = function(obj) {
  var size = 0, key;
  for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

io.on('connection', socket => {
    socket.on('new-user', (name) => {
        users[socket.id] = name; // mindenkinek kulon socket.id-ja van aki belep
        userNumber = Object.size(users);
        // elkuldom magamnak illetve masoknak a userek szamat
        socket.emit('user-number', userNumber);
        socket.broadcast.emit('user-number', userNumber);
        if (users[socket.id] != undefined) {
          messages.push({ name: users[socket.id], message: ' joined', who: 'connection'});
        }
        socket.broadcast.emit('user-connected', name)
        // uj felhasznalonal elkuldjuk a szoba idaigi uzeneteit
        socket.emit('message-list', messages);
      })
      socket.on('send-chat-message', ( message) => {
        socket.broadcast.emit('chat-message', { name: users[socket.id], message: message, who: 'partner' });
        // szoba uzeneteinek megjegyzese, hogy ha uj felhasznalo jon betoltse azokat
        messages.push({ name: users[socket.id], message: message, who: 'partner'});
      })
      socket.on('somebody-is-writing', (name) => {
        socket.broadcast.emit('writing', name);
      })
      socket.on('disconnect', () => {
          socket.broadcast.emit('user-disconnected', users[socket.id]);
          if (users[socket.id] != undefined) {
            messages.push({ name: users[socket.id], message: ' disconnected', who: 'connection'});
          }
          delete users[socket.id]
          userNumber = Object.size(users);
          socket.broadcast.emit('user-number', userNumber);
      })
});


http.listen(4444, () => {
    console.log('Listening on port 4444');
});
