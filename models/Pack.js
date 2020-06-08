'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PackSchema = Schema({
    name: String,
    description: String,
    image: String,
    image_name: [],
    places: [{
        type: Schema.Types.ObjectId,
        ref: 'Place'
    }]
});

module.exports = mongoose.model('Pack', PackSchema);