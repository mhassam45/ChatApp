const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const socketFunction = require('./helpers/socketIo')

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));



// Run when client connects
socketFunction(io);''

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
