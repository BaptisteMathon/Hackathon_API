const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
    idCarLoc: {type: String, required: true},
    dateLoc: {type: Array, required: true},
    idUser: {type: String, required: true},
}, {collection: 'Location'});

module.exports = mongoose.model('Location', locationSchema);