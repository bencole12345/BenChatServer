const router = express.Router();
const passport = require('passport');

const AuthenticationController = require('../controllers/authentication');

const passportService = require('../initialisation/passport');
const requireLogin = passport.authenticate('local', { session: false });

router.post('/login', requireLogin, AuthenticationController.login);

router.post('/register', requireLogin, AuthenticationController.register);



module.exports = router;