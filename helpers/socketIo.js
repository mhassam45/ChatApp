const formatMessage = require('./messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./users');

const socketFunction = (io) => {
    const botName = 'Bot';
    
    io.on('connection', socket => {
        socket.on('joinChat', ({ username, room }) => {
          const user = userJoin(socket.id, username, 'hassam');
      
          socket.join(user.room);
      
          // Welcome new user
          socket.emit('message', formatMessage(botName, 'Welcome to Chat!'));
      
          // send message when user connects
          socket.broadcast
            .to(user.room)
            .emit(
              'message',
              formatMessage(botName, `${user.username} has joined the chat`)
            );
      
          // Send users and room info
          io.to(user.room).emit('users', {
            room: user.room,
            users: getRoomUsers(user.room)
          });
        });
      
        // Listen Messages
        socket.on('chatMessage', msg => {
          const user = getCurrentUser(socket.id);
      
          io.to(user.room).emit('message', formatMessage(user.username, msg));
        });
      
        // when user disconnects
        socket.on('disconnect', () => {
          const user = userLeave(socket.id);
      
          if (user) {
            io.to(user.room).emit(
              'message',
              formatMessage(botName, `${user.username} has left the chat`)
            );
      
            // Send users and room info
            io.to(user.room).emit('users', {
              room: user.room,
              users: getRoomUsers(user.room)
            });
          }
        });
      });
}

module.exports = socketFunction;