const expressWs = require('express-ws');
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors');

const users = require('./app/users');
const messages = require('./app/messages');
const chat = require('./app/chat');

const app = express();
expressWs(app);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(config.dbUrl, config.mongoOptions).then(() => {
    app.use('/users', users);
    app.use('/messages', messages);
    app.ws('/chat', chat);

    app.listen(config.port, () => {
        console.log(`Server started on ${config.port} port`);
    });
});