const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to Selva\'s Private Registry Deployment Homepage!');
});

app.get('/:name', (req, res) => {
    res.send(`Welcome ${req.params.name}`);
});

module.exports = app;