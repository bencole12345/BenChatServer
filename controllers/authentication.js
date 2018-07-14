const User = require('../models/user');


exports.register = function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(422).send({
            error: "You must enter a username and password."
        })
    }

    User.findOne({ username: username }, function(err, existingUser) {
        if (err) return next(err);
        if (existingUser) {
            return res.status(422).send({
                error: "That username is already in use."
            });
        }
        const user = new User({
            username: username,
            password: password
        });

        user.save(function(err, user) {
            if (err) return next(err);
            return res.status(201).send(user.filterSensitiveInformation());
        });
    });
};

exports.login = function(req, res) {
    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) return res.status(500).send(err);
        return res.status(200).send(user.filterSensitiveInformation());
    });
};