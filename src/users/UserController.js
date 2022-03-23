/* eslint-disable quotes */
const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcrypt');
require('dotenv').config();
// eslint-disable-next-line no-undef
const secret = process.env.SECRET;
const jwt = require('jsonwebtoken');

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

router.post('/auth', async (req,res)=>{
    const {email, password} = req.body;
    if (!email && !password) return res.sendStatus(400);

    let existsUser = await User.findOne({"email": email});    

    if(!existsUser) return res.sendStatus(404);

    let isPassRight = await bcrypt.compare(password, existsUser.password);

    if(!isPassRight){
        res.status(403)
        .json({error:'Wrong password and/or email'});
    }

    jwt.sign({email, name: existsUser.name, id: existsUser._id}, 
        secret, {expiresIn: '2h'}, (err, token)=>{
        if(err) res.sendStatus(500);
        else{
            res.status(200).json({token});
        }
    });
});

module.exports = router;