const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

router.get('/', async (req, res) => {
    const messages = await Message.find().populate('user');
    res.send(messages);
});

module.exports = router;