const Conversation = require('../models/conversation');
const User = require('../models/user');

exports.createConversation = function(req, res) {
    if (!req.body.otherUserId) {
        return res.status(400).send({
            error: "You must include otherUserId."
        });
    }
    User.findOne({ username: req.body.username }, function(err, sendingUser) {
        if (err || !sendingUser) return res.status(400).send(err);
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

exports.getConversations = function(req, res) {
    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(500).send({ error: "An internal server error occurred." });
        Conversation.find({ participants: { $in: [user._id] }})
          .populate('participants', '-password')
          .exec(function(err, conversations) {
            if (err) return res.status(500).send(err);
            return res.status(200).send(conversations);
          });
    });
};