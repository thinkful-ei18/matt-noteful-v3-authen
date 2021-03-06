'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');

const Tag = require('../models/tag');
const Note = require('../models/note');

// protect endpoints
// router.use('/tags', passport.authenticate('jwt', { session: false, failWithError: true }));

/* ========== GET/READ ALL ITEMS ========== */
router.get('/tags', (req, res, next) => {
  const userId = req.user.id;

  Tag.find({ userId })
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(next);
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/tags/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Tag.findById({ id, userId })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/tags', (req, res, next) => {
  const { name } = req.body;
  const userId = req.user.id;

  const newTag = { name, userId };

  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  Tag.create(newTag)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The tag name already exists');
        err.status = 400;
      }
      next(err);
    });
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/tags/:id', (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user.id;  

  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const updateTag = { name, userId };

  Tag.findByIdAndUpdate(id, updateTag, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {      
      if (err.code === 11000) {
        err = new Error('The tag name already exists');
        err.status = 400;
      }
      next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/tags/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const tagRemovePromise = Tag.findByIdAndRemove(id);
  // const tagRemovePromise = Tag.remove({ _id: id }); // NOTE **underscore** _id

  const noteUpdatePromise = Note.updateMany(
    { 'tags': id, userId},
    { '$pull': { 'tags': id } }
  );

  Promise.all([tagRemovePromise, noteUpdatePromise])
    .then(([tagResult]) => {
      if (tagResult) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(next);

});

module.exports = router;