const express = require('express');
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({});
});

module.exports = app;