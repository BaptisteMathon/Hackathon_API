const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profilPic: {type: String, default: ''},
    isAdmin: {type: Boolean, default: false},
    bio: {type: String, max: 1024},
    notes: {type: Array, default: []},
}, {collection: 'Users'});

module.exports = mongoose.model('User', userSchema);