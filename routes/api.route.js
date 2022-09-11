const router = require('express').Router();
var ironSession = require("iron-session/express").ironSession;

var session = ironSession({
  password: "complex_password_at_least_32_characters_long",
  cookieName: "rekados",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: 'lax',
  },
});

const AuthController = require('../controllers/auth.controller');

router.get('/', async (req, res, next) => {
  res.send({ message: 'Rekados API Start Here...' });
});

router.post('/register', session, AuthController.register)

router.post('/login', session, AuthController.login)

router.post('/logout', session, AuthController.logout)

router.get('/user', session, AuthController.user)

module.exports = router;
