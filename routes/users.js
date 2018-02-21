'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const User = require('../models/user');

// POST 

router.post('/users', (req, res) => {
  let { fullname, username, password } = req.body;
  // console.log(fullname, username);
  
  return User
    .find({ username })
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return User.create({
        fullname,
        username,
        password
      });
    })
    .then(user => {
      return res.status(201).json(user);
    })
    .catch(err => {
      console.log(err);
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error'});
    });
});

module.exports = router;