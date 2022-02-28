/* eslint-disable no-undef */
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const userController = require('./users/UserController');
const app = express();
const uri = process.env.CONNECTION_STRING;

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//routers
app.use('/', userController);

//db connection
(async function(){
    try {
        await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    } catch (error) {
        console.log(error);
    }
})();

app.get('/', (req, res) => {
    res.sendStatus(200);
});

module.exports = app;