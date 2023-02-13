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
const Users = require('./models/users');

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

            if (savedUser) {
                res.status(200).json(savedUser);
            }
            res.status(404).end()
        } catch (err) {
            console.log(err)
            res.status(500).end()
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
    } else {
        console.log(userName, userEmail, password)
        res.status(500).json({ message: 'Something went wrong!' })
    }

})

app.patch('/addUser', async (req, res) => {
    let boardId = req.body.boardId;
    let userEmail = req.body.userEmail;
    console.log(boardId, userEmail);

    if (boardId && userEmail) {
        try {
            let user = await Users.findOne({ email: userEmail });
            console.log('user', user)

            if (user) {
                //Converting object id to string id
                let modUser = {...user}._doc;
                modUser._id = user._id.toString();

                // console.log('string1', modUser)

                const updatedBoard = await Boards.updateOne(
                    { _id: boardId },
                    { $push: { users: modUser } }
                );

                res.status(200).json(updatedBoard)

            }else{
                res.status(404).json({ message: 'User Not found' })
            }
        } catch (err) {
            res.json({ message: err })
        }
    }
})

app.get('/whitebaords', async (req, res) => {

    let userId = req.query.userId;
    // console.log(req.query)

    if (userId) {
        try {
            const boards = await Boards.find({ 'users._id': userId });
            // console.log('boards', boards)
            res.json(boards)
        } catch (error) {
            console.log(error)
            res.end('500', { message: 'Something went wrong!' })
        }
    } else {
        res.status(500).end()
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
    let createdBy = req.body.createdBy;
    let boardUsers = req.body.users;
    if (!boardUsers) {
        boardUsers = JSON.stringify(createdBy)
    }
    if (boardName && createdBy && boardUsers) {
        try {
            let savedBoard = await Boards.create({
                name: boardName,
                shapes: [],
                createdBy: createdBy,
                users: boardUsers
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
    mongoose.connect(process.env.MONGO_URI)
} catch (err) {
    console.log(err)
}

server.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})