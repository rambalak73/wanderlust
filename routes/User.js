const express = require("express");
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveUrl } = require("../middlewares/middleware");
const UserController = require('../controllers/user');
router.route('/signup')
.get(UserController.signupUser)
.post(wrapAsync(UserController.signup));

router.route('/login')
.get(UserController.renderLogin)
.post(saveUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), wrapAsync(UserController.login));

router.get('/logout', UserController.logoutUser);
module.exports = router;