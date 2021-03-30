'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CensoSchema = Schema({
    name: String,
    subcontent: String,
    content: String,
    type: String,
    url: String,
    date: String,
    client: String,
    image: String,
    images: [],
});

module.exports = mongoose.model('Censo', CensoSchema);