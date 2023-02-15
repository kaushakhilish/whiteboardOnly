const express = require('express');
const Users = require('../models/users');

const router = express.Router();

router.post('/login', async (req, res) => {
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
router.post('/signUp', async (req, res) => {
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

module.exports = router;