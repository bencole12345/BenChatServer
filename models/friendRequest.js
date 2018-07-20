const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PendingFriendshipSchema = new Schema({
    sentFrom: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    sentTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('FriendRequest', PendingFriendshipSchema);