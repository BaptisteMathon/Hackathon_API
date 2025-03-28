const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profilPic: {type: String, default: 'https://static.vecteezy.com/ti/vecteur-libre/p1/1840612-image-profil-icon-male-icon-human-or-people-sign-and-symbol-vector-gratuit-vectoriel.jpg'},
    isAdmin: {type: Boolean, default: false},
    bio: {type: String, max: 1024},
    notes: {type: Array, default: []},
}, {collection: 'Users'});

module.exports = mongoose.model('User', userSchema);