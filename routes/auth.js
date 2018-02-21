'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const {JWT_SECRET, JWT_EXPIRY} = require('./../config')

const options = {session: false, failWithError: true};
const localAuth = passport.authenticate('local', options);

function createAuthToken (user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

// old
// router.post('/login', localAuth, function (req, res) {
//   return res.json(req.user);
// });

// new - with jwt
router.post('/login', localAuth, function (req, res) {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.post('/refresh', jwtAuth, (req, res) => {
  // console.log(req.user);
  
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = router;