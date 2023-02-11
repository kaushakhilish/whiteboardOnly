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

const Boards = require('./models/Boards');
const Users = require('./models/Users');

app.use(cors({
    'Access-Control-Allow-Origin': '*'
}))

app.use(express.json());

app.use(express.static('client/dist'))


app.post('/login', async (req, res) => {
    let userEmail = req.body.email;
    let password = req.body.password;

    if (userEmail && password) {
        try {
            let savedUser = await Users.findOne({
                email: userEmail,
                password: password,
            });

            if(savedUser){
                res.json(savedUser);
                // res.end(200);
            }
            // res.status(404).end('User Not Found!!')
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Something went wrong!' })
        }
    }
})
app.post('/signUp', async (req, res) => {
    let userName = req.body.userName;
    let userEmail = req.body.email;
    let password = req.body.password;

    console.log(req.body)
    if (userName && userEmail && password) {
        try {
            let savedUser = await Users.create({
                name: userName,
                email: userEmail,
                password: password,
            });
            res.json(savedUser);

        } catch (err) {
            console.log('error', err)
            res.status(500).json({ message: 'Something went wrong!' })
        }
    }else{
        console.log(userName, userEmail, password)
        res.status(500).json({ message: 'Something went wrong!' })
    }

})

app.get('/whitebaords', async (req, res) => {

    try {
        const boards = await Boards.find();
        res.json(boards)
    } catch (error) {
        console.log(error)
        res.end('500', { message: 'Something went wrong!' })
    }
})
app.get('/whiteboard/:id', async (req, res) => {
    let id = req.params.id;

    try {
        const board = await Boards.findById(id);
        res.json(board)
    } catch (error) {
        console.log(error)
        res.end('500', { message: 'Something went wrong!' })
    }
})

app.patch('/whitebaord', async (req, res) => {
    const board = req.body;

    try {
        const updatedBoard = await Boards.updateOne(
            { _id: board._id },
            { $set: { shapes: board.shapes } }
        );


        res.json(updatedBoard)
    } catch (err) {
        res.json({ message: err })
    }
})

app.post('/createWhiteboard', async (req, res) => {

    console.log(req.body)

    let boardName = req.body.boardName;

    if (boardName) {
        try {
            let savedBoard = await Boards.create({
                name: boardName,
                shapes: []
            });
            res.json(savedBoard)
        } catch (err) {
            console.log(err)
            res.end(500, { message: 'Something went wrong!' })
        }
    } else {
        res.status(500).json('Something went wrong!')
    }
})

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
    mongoose.connect(process.env.MONGO_URII)
} catch (err) {
    console.log(err)
}

server.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})