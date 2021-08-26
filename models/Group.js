'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = Schema({
    name: String,
    teacher: String,
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }]
});

module.exports = mongoose.model('Group', GroupSchema);