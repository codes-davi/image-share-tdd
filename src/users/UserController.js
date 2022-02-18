const express = require('express');
const router = express.Router();
const User = require('./User');

router.post('/user', async (req, res) => {
    let {name, email, password} = req.body;

    if(!name || !email || !password) return res.sendStatus(400);
    let user = new User({name: name, email: email, password: password});
    user = await user.save();
    
    if (!user) res.sendStatus(500);
    else res.status(201).json(user);
});

module.exports = router;