'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlaceSchema = Schema({
    name: String,
    city: String,
    image: String,
    image_name: [],
    description: String,
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    packs: [{
        type: Schema.Types.ObjectId,
        ref: 'Pack'
    }]
});

module.exports = mongoose.model('Place', PlaceSchema);