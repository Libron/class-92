const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

router.get('/', async (req, res) => {
    let limit = null;

    if (req.query.limit) {
        limit = parseInt(req.query.limit);
    }
    const messages = await Message.find().sort('-datetime').limit(limit).populate('user');
    res.send(messages);
});

module.exports = router;