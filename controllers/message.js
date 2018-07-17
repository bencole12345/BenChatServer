const Conversation = require('../models/conversation');
const Message = require('../models/message');
const User = require('../models/user');

exports.sendMessage = function(req, res) {
    if (!req.body.conversationId) return res.status(400).send({ error: "You must include a conversationId." });
    if (!req.body.messageContent) return res.status(400).send({ error: "You must include messageContent." });
    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(500).send({ error: "An internal error occurred." });
        Conversation.findOne({ _id: req.body.conversationId}, function(err, conversation) {
            if (err) return res.status(500).send(err);
            if (!conversation) return res.status(400).send({ error: "conversationId not recognised." });
            message = new Message({
                author: user._id,
                conversationId: conversation._id,
                content: req.body.messageContent
            });
            message.save(function(err, result) {
                if (err) return res.status(500).send(err);
                return res.status(201).send(result);
            });
        });
    });
};

exports.getMessages = function(req, res) {
    if (!req.body.conversationId) return res.status(400).send({ error: "You must include a conversationId." });
    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(500).send({ error: "An internal error occurred." });
        Conversation.findOne({ _id: req.body.conversationId }, function(err, conversation) {
            if (err) return res.status(500).send(err);
            if (!conversation) return res.status(400).send({ error: "conversationId not recognised." });
            Message.find({ conversationId: req.body.conversationId })
                .populate('author', '-password')
                .sort({ createdAt: 'ascending' })
                .exec(function(err, messages) {
                    if (err) return res.status(500).send(err);
                    if (!messages) return res.stats(500).send({ error: "An internal error occurred." });
                    return res.status(200).send(messages);
                });
        });
    });
};