const Conversation = require('../models/conversation');
const Message = require('../models/message');
const User = require('../models/user');

exports.sendMessage = function(req, res) {
    if (!req.body.recipientId) {
        return res.status(400).
    }
};

exports.getMessages = function(req, res) {

};