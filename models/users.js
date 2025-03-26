const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profilPic: {type: String, default: ''},
    isAdmin: {type: Boolean, default: false},
    idLocCars : {type: Array, default: []},
    bio: {type: String, max: 1024},
    notes: {type: Array, default: []},
});

module.exports = mongoose.model('User', userSchema);