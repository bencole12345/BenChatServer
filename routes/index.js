const express = require('express');
const passport = require('passport');

const AuthenticationController = require('../controllers/authentication');
const ConversationController = require('../controllers/conversation');
const MessageController = require('../controllers/message');

const passportService = require('../initialisation/passport');  // Setup, registers the LocalStrategy
const requireLogin = passport.authenticate('local', { session: false });  // Middleware

const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("Hello!");
});


/**
 * Authentication routing (/auth)
 */
const authRouter = express.Router();
router.use('/auth', authRouter);
authRouter.use('/login', requireLogin, AuthenticationController.login);
authRouter.use('/register', AuthenticationController.register);

/**
 * Conversation routing (/conversations)
 */
const conversationRouter = express.Router();
router.use('/conversations', conversationRouter);
conversationRouter.post('/all', requireLogin, ConversationController.getConversations);
conversationRouter.post('/new', requireLogin, ConversationController.createConversation);

/**
 * Message routing (/messages)
 */
const messageRouter = express.Router();
router.use('/messages', messageRouter);
messageRouter.use('/view', requireLogin, MessageController.getMessages);
messageRouter.use('/send', requireLogin, MessageController.sendMessage);

module.exports = router;
