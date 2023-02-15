const express = require('express');
const Boards = require('../models/Boards');
const Users = require('../models/users');

const router = express.Router();

router.get('/messages/:boardId', async (req, res) => {
    let id = req.params.boardId;

    if (id) {
        try {
            const board = await Boards.findById(id);

            if (board) {
                res.status(200).json(board.chats);
            }
            res.status(404).end()
        } catch (err) {
            console.log(err)
            res.status(500).end()
        }
    }
})

router.post('/messages', async (req, res) => {
    let boardId = req.body.boardId;
    let message = req.body.message;
    message.time = new Date();
    
    if (boardId && message) {
        try {
            const updatedBoard = await Boards.updateOne(
                { _id: boardId },
                { $push: { chats: message } }
            );

            if (updatedBoard) {
                res.status(200).json(updatedBoard);
            }
            res.status(404).end()
        } catch (err) {
            console.log(err)
            res.status(500).end()
        }
    }
})

router.patch('/addUser', async (req, res) => {
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

router.get('/all', async (req, res) => {

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
router.get('/:id', async (req, res) => {
    let id = req.params.id;

    try {
        const board = await Boards.findById(id);
        res.json(board)
    } catch (error) {
        console.log(error)
        res.end('500', { message: 'Something went wrong!' })
    }
})

router.patch('/', async (req, res) => {
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

router.post('/create', async (req, res) => {

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

module.exports = router;