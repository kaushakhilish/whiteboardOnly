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
app.use('/uploads', express.static('uploads'))

const userRoute = require('./routes/users');
const whiteboardRoute = require('./routes/whiteboard');

app.use('/users', userRoute);
app.use('/whiteboard', whiteboardRoute);



//Board Socket rooms
// let BoardUsers = [];
let Rooms = [];
io.on('connection', (socket) => {
    console.log('Socket id', socket.id);
    console.log('Handshake querry', socket.handshake.query);
    console.log('Handshake user', socket.handshake.query.user);

    let roomIndex;
    let roomId = socket.handshake.query.roomId
    let boardUser = JSON.parse(socket.handshake.query.user);
    socket.join(socket.handshake.query.roomId);
    
    Rooms.forEach((room, index) => {
        if(room.id === roomId){
            roomIndex = index
        }
    })

    if(roomIndex === undefined){
        Rooms.push({
            id: roomId,
            users: [boardUser]
        })
        roomIndex = 0;
    }else{
        Rooms[roomIndex].users.push(boardUser)
    }

    console.log('Rooms', Rooms);

    socket.emit('New_User', Rooms[roomIndex])
    socket.to(roomId).emit('New_User', Rooms[roomIndex])

    socket.on('get_users', ({roomId, userId}) => {

    })

    socket.on('board_updated', ({ roomId, userId }) => {
        console.log('boardUpdate', boardUser)
        socket.broadcast.to(roomId).emit('board_updated', { boardUser })
    })
    socket.on('new_message', ({ roomId }) => {
        console.log('new_message')
        socket.broadcast.to(roomId).emit('new_message', { roomId })
    })

    socket.on('disconnect', (e) => {
        // BoardUsers = BoardUsers.filter((BoardUser) => {
        //     console.log(BoardUser, socket.id)
        //     return BoardUser !== socket.id;
        // });
        console.log('disconnected', boardUser)
        if(Rooms[roomIndex].users){
            Rooms[roomIndex].users = Rooms[roomIndex].users.filter((user) => {
                return boardUser.id !== user.id;
            })
        }
        socket.broadcast.emit('User_Disconnect', Rooms[roomIndex])

        console.log('disconnected', Rooms);
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