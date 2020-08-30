const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email:String,
    password: String,
    admin: Boolean,
    active: Boolean,
    image:  String,        
    image_name: [],
    register_date: {
        type: Date,
        default: Date.now
    }
});

module.exports =
    User = mongoose.model('User', UserSchema);