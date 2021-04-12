'use strict'

var express = require('express');
var CommentController = require('../../controllers/comment');
const auth = require('../../middleware/auth');

var router = express.Router();

router.post('/add', CommentController.addComment);
router.get('/allComments', CommentController.getComments);

module.exports = router;