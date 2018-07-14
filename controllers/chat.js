const Conversation = require('../models/conversation');
const Message = require('../models/message');
const User = require('../models/user');

exports.createConversation = function(req, res) {
    if (!req.body.otherUserId) {
        return res.status(400).send({
            error: "You must include otherUserId."
        });
    }
    User.findOne({ username: req.body.username }, function(err, sendingUser) {
        if (err || !sendingUser) return res.status(200).send(err);
        Conversation.findOne({participants: [
            sendingUser._id,
            req.body.otherUserId
        ]}, function(err, existingConversation) {
            if (err) return res.status(500).send(err);
            if (existingConversation) return res.status(422).send({
                error: "A conversation between these users already exists.",
                _id: existingConversation._id
            });
            // We are clear to make a new conversation
            const conversation = new Conversation({
                participants: [
                    sendingUser._id,
                    req.body.otherUserId
                ]
            });
            conversation.save(function(err, convo) {
                if (err) return res.status(500).send(err);
                return res.status(201).send(convo);
            });
        });
    });
};

exports.sendMessage = function(req, res) {

};

exports.getMessages = function(req, res) {

};