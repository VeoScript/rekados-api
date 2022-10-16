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
const UserController = require('../controllers/user.controller');
const DishController = require('../controllers/dish.controller');
const LikeController = require('../controllers/like.controller');
const CommentController = require('../controllers/comment.controller');
const SaveDishController = require('../controllers/savedish.controller');
const SearchController = require('../controllers/search.controller');

router.get('/', async (req, res, next) => {
  res.send({ message: 'Rekados API Start Here...' });
});

// Authentication Routes
router.get('/user', session, AuthController.user)
router.post('/register', session, AuthController.register)
router.post('/login', session, AuthController.login)
router.post('/logout', session, AuthController.logout)

// User Routes
router.get('/user/:id', session, UserController.user)

// Dishes Routes
router.get('/dishes', DishController.index)
router.get('/dish/:slug', session, DishController.show)
router.post('/create-dish', session, DishController.store)
router.post('/create-ingredient', session, DishController.storeIngredients)
router.post('/create-procedure', session, DishController.storeProcedures)
router.put('/update-dish', session, DishController.update)
router.delete('/delete-dish/:slug', session, DishController.destroy)

// Likes Routes
router.post('/like', session, LikeController.like)
router.delete('/unlike', session, LikeController.unlike)

// Comments Routes
router.get('/comments', session, CommentController.index)
router.post('/create-comment', session, CommentController.store)

// Saved Dish Routes
router.get('/save-dish', session, SaveDishController.index)

// Search Routes
router.get('/search-dish/:title', session, SearchController.searchDishes)
router.get('/search-user/:name', session, SearchController.searchUsers)

module.exports = router;
