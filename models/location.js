const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
    idCarLoc: {type: String, required: true},
    dateLoc: {type: Array, required: true},
});

module.exports = mongoose.model('Location', locationSchema);