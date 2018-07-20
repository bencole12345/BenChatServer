const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const FriendshipSchema = new Schema({
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Friendship', FriendshipSchema);