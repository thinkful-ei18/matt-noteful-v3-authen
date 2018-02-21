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
  
  return User.hashPassword(password)
  .then(digest => {
    const newUser = {
      username,
      password: digest,
      fullname
    };
    return User.create(newUser);
  })
  .then(result => {
    return res.status(201).location(`/api/users/${result.id}`).json(result);
  })
  .catch(err => {
    if (err.code === 11000) {
      err = new Error('The username already exists');
      err.status = 400;
    }
    next(err);
  });
  
  // return User
  //   .find({ username })
  //   .count()
  //   .then(count => {
  //     if (count > 0) {
  //       return Promise.reject({
  //         code: 422,
  //         reason: 'ValidationError',
  //         message: 'Username already taken',
  //         location: 'username'
  //       });
  //     }
  //     return User.create({
  //       fullname,
  //       username,
  //       password
  //     });
  //   })
  //   .then(user => {
  //     return res.status(201).json(user);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     if (err.reason === 'ValidationError') {
  //       return res.status(err.code).json(err);
  //     }
  //     res.status(500).json({ code: 500, message: 'Internal server error'});
  //   });


});

module.exports = router;