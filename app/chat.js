const nanoid = require('nanoid');
const User = require('../models/User');

const activeConnections = {};

const getActiveUsernames = connections => {
    return Object.keys(connections).map(connId => {
        const conn = connections[connId];
        return conn.user.displayname;
    });
};

const sendTo = (connections, msg) => {
    Object.keys(connections).map(connId => {
        const conn = connections[connId];
        conn.ws.send(JSON.stringify(msg));
    });
};


const chat = async (ws, req) => {
    const token = req.query.token;

    if (!token) {
        return ws.close();
    }

    const user = await User.findOne({token});

    if (!user) {
        return ws.close();
    }

    const id = nanoid();
    console.log(`client ${user.displayname} connected! with ${id}`);
    activeConnections[id] = {user, ws};

    sendTo(activeConnections, {
        type: 'NEW_USER',
        displayname: user.displayname,
        activeUsers: getActiveUsernames(activeConnections)
    });

    ws.on('message', msg => {
        let decodedMessage;

        try {
            decodedMessage = JSON.parse(msg);
        } catch (e) {
            return console.log('Not valid message');
        }

        switch (decodedMessage.type) {
            case 'CREATE_MESSAGE':   // {type: 'CREATE_MESSAGE', text: 'Hello'}
                // {type: 'NEW_MESSAGE', text: 'Hello'}
                sendTo(activeConnections, {
                    type: 'NEW_MESSAGE',
                    message: {
                        displayname: user.displayname,
                        text: decodedMessage.text
                    }
                });
                console.log('i m heere');

                break;
            default:
                console.log('Not valid message', decodedMessage.type);
        }
    });

    // ws.on('close', msg => {
    //     delete activeConnections[id];
    //     ws.send();
    // });
};

module.exports = chat;