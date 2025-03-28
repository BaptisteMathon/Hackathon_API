const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    User1: { type: String, required: true },
    User2: { type: String, required: true },
    idCar: { type: String, required: true },
    messages: [{
        sender: { type: String, required: true },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        sentAt: { type: Date, default: Date.now }
    }]
}, { collection: 'Conversation' })

module.exports = mongoose.model('Conversation', conversationSchema);