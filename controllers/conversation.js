const Conversation = require('../models/conversation');
const User = require('../models/user');

const mongoose = require('mongoose');

exports.createConversation = function(req, res) {
    if (!req.body.conversationName)
        return res.status(400).send({
            error: "You must include conversationName."
        });
    if (req.body.otherUsers) {
        User.findOne({ username: req.body.username }, function(err, creatingUser) {
            if (err) return res.status(500).send(err);
            // TODO: Check the IDs for the other users exist
            // TODO: Check that a conversation between these people doesn't already exist
            // var allParticipants = [creatingUser._id] + req.body.otherUsers.map(x => mongoose.Types.ObjectId(x._id));
            console.log(req.body.otherUsers);
            console.log(creatingUser._id);
            var allParticipants = [creatingUser._id].concat(req.body.otherUsers);
            console.log(allParticipants);
            const conversation = new Conversation({
                participants: allParticipants,
                name: req.body.conversationName
            });
            conversation.save(function(err, conv) {
                if (err) return res.status(500).send(err);
                return res.status(201).send(conv);
            });
        });
    } else if (req.body.otherUsername) {
        User.findOne({ username: req.body.username }, function(err, sendingUser) {
            if (err || !sendingUser) return res.status(500).send(err);
            User.findOne({ username: req.body.otherUsername }, function(err, otherUser) {
                if (err) return res.status(500).send(err);
                if (!otherUser) return res.status(400).send({ error: "Username not recognised." });
                Conversation.findOne({participants: [
                        sendingUser._id,
                        otherUser._id
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
                            otherUser._id
                        ]
                    });
                    conversation.save(function(err, convo) {
                        if (err) return res.status(500).send(err);
                        return res.status(201).send(convo);
                    });
                });
            });
        });
    } else {
        return res.status(400).send({
            error: "You must include an array called otherUsers."
        });
    }
};

exports.getConversations = function(req, res) {
    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(500).send({ error: "An internal server error occurred." });
        Conversation.find({ participants: { $in: [user._id] }})
            .populate('participants', 'username _id')
            .exec(function(err, conversations) {
                if (err) return res.status(500).send(err);
                return res.status(200).send(conversations);
        });
    });
};