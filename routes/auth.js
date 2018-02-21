'use strict';
const express = require('express');
// const bodyParser = require('body-parser');

const passport = require('passport');
// const { Strategy: LocalStrategy } = require('passport-local');

// const { User } = require('./../models/user');

const router = express.Router();

// router.use(bodyParser.json());

const options = {session: false, failWithError: true};

const localAuth = passport.authenticate('local', options);

router.post('/login', localAuth, function (req, res) {
  return res.json(req.user);
});

module.exports = router;