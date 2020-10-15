'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CensoSchema = Schema({
    name: String,
    lastname: String,
    email: String,
    phone: Number,
    age: Number,
    arrival_date: Date,
    status: String,
    register_no: String,
    register_date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Censo', CensoSchema);