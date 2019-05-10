const mongoose = require('mongoose');
const config = require('./config');

const loremIpsum = require("lorem-ipsum").loremIpsum;
const nanoid = require('nanoid');

const User = require('./models/User');
const Message = require('./models/Message');

const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
};

const generateRandomMessages = (users) => {
    const messages = [];
    users.map(user => {
        const numberOfTracks = getRndInteger(10, 15);
        for (let i = 0; i < numberOfTracks; i++) {
            messages.push({
                text: loremIpsum(),
                user: user._id
            });
        }
    });
    return messages;
};

const run = async () => {
    await mongoose.connect(config.dbUrl, config.mongoOptions);

    const connection = mongoose.connection;

    const collections = await connection.db.collections();

    for (let collection of collections) {
        await collection.drop();
    }

    const users = await User.create(
        {
            username: 'ivan',
            password: '123',
            displayname: 'Ivan Krymchenko',
            image: 'ava1.jpg',
            role: 'user',
            token: nanoid()
        },
        {
            username: 'gena',
            password: '123',
            displayname: 'Gena Kunjutov',
            image: 'ava2.jpg',
            role: 'moderator',
            token: nanoid()
        },
        {
            username: 'irina',
            password: '123',
            displayname: 'Irina Kuzmina',
            image: 'ava3.jpg',
            role: 'user',
            token: nanoid()
        }
    );

    const messages = generateRandomMessages(users);
    await Message.create(
        ...messages
    );

    return connection.close();
};

run().catch(error => {
    console.error('Something went wrong!', error);
});