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
const DishController = require('../controllers/dish.controller');

router.get('/', async (req, res, next) => {
  res.send({ message: 'Rekados API Start Here...' });
});

// Authentication Routes
router.post('/register', session, AuthController.register)
router.post('/login', session, AuthController.login)
router.post('/logout', session, AuthController.logout)
router.get('/user', session, AuthController.user)

// Dishes Routes
router.get('/dishes', session, DishController.index)
router.post('/create-dish', session, DishController.store)

module.exports = router;
