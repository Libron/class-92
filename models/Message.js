const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        type: Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    datetime: {type : Date, default: Date.now },
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;