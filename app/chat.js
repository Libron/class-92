const nanoid = require('nanoid');
const User = require('../models/User');

const activeConnections = {};

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
    console.log('client connected! id=', id);
    activeConnections[id] = {user, ws};

    const displaynames = Object.keys(activeConnections).map(connId => {
       const conn = activeConnections[connId];

       return conn.user.displayname;
    });

    Object.keys(activeConnections).map(connId => {
       const conn = activeConnections[connId];

       conn.ws.send(JSON.stringify({
           type: 'NEW_USER',
           displayname: user.username
       }))
    });

    let username = '';

    ws.on('message', msg => {

        let decodedMessage;

        try {
            decodedMessage = JSON.parse(msg);
        } catch (e) {
            return console.log('Not valid message');
        }

        switch (decodedMessage.type) {
            case 'SET_USERNAME':    // {type: 'SET_USERNAME', username: 'John Doe'}
                username = decodedMessage.username;
                break;
            case 'CREATE_MESSAGE':   // {type: 'CREATE_MESSAGE', text: 'Hello'}
                // {type: 'NEW_MESSAGE', text: 'Hello'}

                Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId];
                    conn.send(JSON.stringify({
                        type: 'NEW_MESSAGE',
                        mesage: {
                            username,
                            text: decodedMessage.text
                        }
                    }));
                });
                break;
            default:
                console.log('Not valid message', decodedMessage.type);
        }
    });

    ws.on('close', msg => {
        console.log('client disconnected! id=', id);
        delete activeConnections[id];
    });
};

module.exports = chat;