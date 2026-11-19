const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to the Private Registry Deployment Homepage!');
});

app.get('/:name', (req, res) => {
    res.send(`Welcome ${req.params.name}`);
});

module.exports = app;