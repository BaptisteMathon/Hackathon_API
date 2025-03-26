const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
    photo: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    nameCar: {type: String, required: true},
    IdOwner: {type: String, required: true},
    mark: {type: String, required: true},
    model: {type: String, required: true},
    fuel: {type: String, required: true},
    gearBox: {type: String, required: true},
    doorsNumber: {type: Number, required: true},
    universe: {type: String, required: true},
    franchise: {type: String, required: true},
    city: {type: String, required: true},
}, {collection: 'Cars'});

module.exports = mongoose.model('Cars', carSchema);