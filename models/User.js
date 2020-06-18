const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    register_date: {
        type: Date,
        default: Date.now
    }
});

module.exports =
    User = mongoose.model('User', UserSchema);