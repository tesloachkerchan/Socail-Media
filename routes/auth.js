const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

//Register
router.post('/register', async (req, res) => {
    try {
        //hashing password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        //register user
        const newUser = await new User({
        userName: req.body.userName,
        email: req.body.email,
        password: hashedPassword,
            desc: req.body.desc,
            city: req.body.city,
            from: req.body.from
        
        
    })
        const user = await newUser.save();
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
})
//Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        //if user not found
        !user && res.status(404).send('user not found!')
        //checking the password
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).send('invalid password!')
        //if user
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
})
module.exports = router