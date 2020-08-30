'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = Schema({

    comment: String,
    rating: Number,
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place'
    },
});

module.exports = mongoose.model('Comment', CommentSchema);