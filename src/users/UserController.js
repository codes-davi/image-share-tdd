/* eslint-disable quotes */
const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcrypt');

router.post('/user', async (req, res) => {
    let {name, email, password} = req.body;

    if(!name || !email || !password) return res.sendStatus(400);
    try {
        let userExists = await User.findOne({"email": email });
        
        if (userExists != undefined) return res.sendStatus(400);

        let salt = await bcrypt.genSalt(10);
        let hashed = await bcrypt.hash(password, salt);

        let user = new User({ name: name, email: email, password: hashed });
        
        user = await user.save();
        
        if (!user) res.sendStatus(500); 
        else res.status(201).json(user);

    } catch (error) {        
        res.sendStatus(500);
    }
});

router.delete('/user/:email', async (req, res) => {
    let {email} = req.params;
    try {
        console.log("PASSOU AQUI");
        let result = await User.deleteOne({"email": email});
        res.json(result);
    } catch (error) {
        res.sendStatus(500);
    }
});

module.exports = router;