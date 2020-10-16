'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CensoSchema = Schema({
    name: String,
    lastname: String,
    email: String,
    phone: String,
    age: Number,
    arrival_date: Date,
    status: String,
    register_no: String,
    register_date: {
        type: Date,
        default: Date.now
    },
    image: String,
    image_name: [],
});

module.exports = mongoose.model('Censo', CensoSchema);