const mongoose = require('mongoose');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const { Server } = require("socket.io");
const io = new Server(server);

require('dotenv').config();

const PORT = process.env.PORT || 4000;

app.use(cors({
    'Access-Control-Allow-Origin': '*'
}))




app.use(express.json());
app.use(express.static('client/dist'));
app.use('/images', express.static('images'))

const userRoute = require('./routes/users');
const whiteboardRoute = require('./routes/whiteboard');

app.use('/users', userRoute);
app.use('/whiteboard', whiteboardRoute);

let BoardUsers = [];
io.on('connection', (socket) => {
    console.log('Socket id', socket.id);
    socket.join(socket.handshake.query.roomId);
    BoardUsers.push(socket.id);
    console.log(BoardUsers);

    socket.emit('New_User', { BoardUsers })

    socket.on('board_updated', ({ roomId, userId }) => {
        console.log('boardUpdate', BoardUsers)
        socket.broadcast.to(roomId).emit('board_updated', { userId, BoardUsers })
    })
    socket.on('new_message', ({ roomId }) => {
        console.log('new_message')
        socket.broadcast.to(roomId).emit('new_message', { roomId })
    })

    socket.on('disconnect', () => {
        BoardUsers = BoardUsers.filter((BoardUser) => {
            console.log(BoardUser, socket.id)
            return BoardUser !== socket.id;
        });
        socket.broadcast.emit('User_Disconnect', { BoardUsers })

        console.log('disconnected', BoardUsers, socket.id);
    })
});

//Connect to database
try {
    mongoose.connect(process.env.MONGO_URI)
} catch (err) {
    console.log(err)
}

server.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})