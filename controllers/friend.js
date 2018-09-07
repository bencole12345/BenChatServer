const mongoose = require('mongoose');

const FriendRequest = require('../models/friendRequest');
const User = require('../models/user');

/**
 * Request to add someone as your friend.
 */
exports.addFriend = function(req, res) {
    if (!req.body.otherUsername) {
        return res.status(400).send({ error: "You must include otherUsername." });
    }
    if (req.body.otherUsername === req.body.username) {
        return res.status(400).send({ error: "You can't add yourself as a friend" });
    }
    User.findOne({ username: req.body.username }, function(err, thisUser) {
        if (err) return res.status(500).send(err);
        if (!thisUser) return res.status(500).send({ error: "An internal error occurred." });
        User.findOne({ username: req.body.otherUsername }, function(err, otherUser) {
            if (err) return res.status(500).send(err);
            if (!otherUser) return res.status(404).send({ error: "User not found." });
            if (thisUser.friends.some((id) => id.equals(otherUser._id)))
                return res.status(422).send({error: "You are already friends!"});
            FriendRequest
                .findOne()
                .or([{
                        sentFrom: thisUser._id,
                        sentTo: otherUser._id
                    }, {
                        sentFrom: otherUser._id,
                        sentTo: thisUser._id
                    }])
                .exec(function(err, existingPendingFriendship) {
                        if (err) return res.status(500).send(err);
                        if (existingPendingFriendship) {
                            console.log(existingPendingFriendship);
                            return res.status(422).send({
                                err: "You already have a pending friendship!",
                                _id: existingPendingFriendship._id
                            });
                        }
                        const pendingFriendship = new FriendRequest({
                            sentFrom: thisUser._id,
                            sentTo: otherUser._id
                        });
                        pendingFriendship.save(function(err, createdPendingFriendship) {
                            if (err) return res.status(500).send(err);
                            return res.status(201).send(createdPendingFriendship);
                        });
                    });
        });
    });
};

/**
 * Get a list of all friends.
 */
exports.allFriends = function(req, res) {
    User.findOne({username: req.body.username})
        .populate('friends', '_id username')
        .exec(function(err, user) {
            if (err) return res.status(500).send(err);
            if (!user) return res.status(500).send({error: "An internal error occurred."});
            return res.status(200).send(user.friends);
        });
};

/**
 * Get a list of all sent and received friend requests.
 */
exports.allFriendRequests = function(req, res) {
    User.findOne({username: req.body.username}, function(err, user) {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(500).send({error: "An internal error occurred."});
        FriendRequest
            .find({sentFrom: user._id})
            .populate('sentFrom', '_id username')
            .populate('sentTo', '_id username')
            .exec(function(err, sentRequests) {
                if (err) return res.status(500).send(err);
                FriendRequest
                    .find({sentTo: user._id})
                    .populate('sentFrom', '_id username')
                    .populate('sentTo', '_id username')
                    .exec(function(err, receivedRequests) {
                        if (err) return res.status(500).send(err);
                        return res.status(200).send({
                            sent: sentRequests,
                            received: receivedRequests
                        }
                );
            });
        });
    });
};

/**
 * Respond to a friend request.
 */
exports.respondToFriendRequest = function(req, res) {
    if (!req.body.friendRequestId) return res.status(400).send({error: "You must include friendRequestId."});
    if (!mongoose.Types.ObjectId.isValid(req.body.friendRequestId)) return res.status(400).send({error: "Invalid friendRequestId."});
    if (req.body.response !== "accept" && req.body.response !== "decline")
        return res.status(400).send({error: "You must include 'response' with the value 'accept' or 'decline'."});
    User.findOne({username: req.body.username}, function(err, user) {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(500).send({error: "An internal error occurred."});
        FriendRequest.findById(req.body.friendRequestId, function(err, existingFriendRequest) {
            if (err) return res.status(500).send(err);
            if (!existingFriendRequest) return res.status(404).send({error: "Friend request not found."});
            if (!existingFriendRequest.sentTo.equals(user._id)) return res.status(401).send({
                error: "You do not have permission to accept or deny this friend request."
            });
            if (req.body.response === "accept") {
                User.findById(existingFriendRequest.sentFrom, function(err, otherUser) {
                    if (err) return res.status(500).send(err);
                    if (!otherUser) return res.status(500).send({error: "An internal error occurred."});
                    FriendRequest.findOneAndDelete({_id: existingFriendRequest._id}, function(err, result) {
                        if (err) return res.status(500).send(err);
                        user.friends.push(otherUser._id);
                        user.save(function(err, result) {
                            if (err) return res.status(500).send(err);
                            if (!result) return res.status(500).send({error: "An internal error occurred."});
                            otherUser.friends.push(user._id);
                            otherUser.save(function(err, result) {
                                if (err) return res.status(500).send(err);
                                if (!result) return res.status(500).send({error: "An internal error occurred."});
                                return res.status(200).send();
                            });
                        })
                    });
                });
            } else {
                FriendRequest.findOneAndDelete({_id: existingFriendRequest._id}, function(err, result) {
                    if (err) return res.status(500).send(err);
                    return res.status(200).send("Deleted!");
                })
            }
        });
    });
};

/**
 * Cancel a friend request that was sent.
 */
exports.cancelFriendRequest = function(req, res) {
    if (!req.body.friendRequestId) return res.status(400).send({error: "You must include friendRequestId."});
    if (!mongoose.Types.ObjectId.isValid(req.body.friendRequestId)) return res.status(400).send({error: "Invalid friendRequestId."});
    User.findOne({username: req.body.username}, function(err, user) {
        if (err) return res.status(500).send(err);
        FriendRequest.findById(req.body.friendRequestId, function(err, friendRequest) {
            if (err) return res.status(500).send(err);
            if (!friendRequest) return res.status(404).send({error: "Friend request not found."});
            console.log(friendRequest);
            console.log(user);
            if (friendRequest.sentFrom._id.equals(user._id)) {
                FriendRequest.deleteOne({ _id: friendRequest._id }, function(err) {
                    if (err) return res.status(200).send(err);
                    return res.status(200).send("Deleted!");
                });
            } else {
                return res.status(403).send({error: "You cannot cancel this friend request because you did not send it."});
            }
        });
    });
};