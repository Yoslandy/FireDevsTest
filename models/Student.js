'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentSchema = Schema({
    name: String,
    email: String,
    sex: String,
    age: Number,
    dateBirth: String,
    cityBirth: String,
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
});

module.exports = mongoose.model('Student', StudentSchema);