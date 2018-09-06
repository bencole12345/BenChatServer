const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    name: Schema.Types.String
});

module.exports = mongoose.model('Conversation', ConversationSchema);