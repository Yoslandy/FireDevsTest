'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = Schema({
    client: String,
    company: String,
    position: String,
    comment: String,
});

module.exports = mongoose.model('Comment', CommentSchema);