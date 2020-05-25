'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlaceSchema = Schema({
    name: String,
    city: String,
    image: String,
    image_name: [],
    packs: [{
        type: Schema.Types.ObjectId,
        ref: 'Pack'
    }]
});

module.exports = mongoose.model('Place', PlaceSchema);