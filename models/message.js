const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', MessageSchema);