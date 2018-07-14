const express = require('express');
const passport = require('passport');

const AuthenticationController = require('../controllers/authentication');

const passportService = require('../initialisation/passport');  // Setup, registers the LocalStrategy
const requireLogin = passport.authenticate('local', { session: false });  // Middleware

const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("Hello!");
});


/**
 * Setup authentication routing
 */
const authRouter = express.Router();
router.use('/auth', authRouter);
authRouter.use('/login', requireLogin, AuthenticationController.login);
authRouter.use('/register', AuthenticationController.register);




module.exports = router;
