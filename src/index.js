const config = require('config');

//const db = new DatabaseClass(config);
const express = require('express');
const app = express();
app.use('/', require('./routes/healthcheck'));
app.use('/movies', require('./routes/movies'));

module.exports = app;