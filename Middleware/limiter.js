const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

const limiteur = rateLimit({
    windowMs: 30 * 1000,
    max: 100,
    message: 'Trop de requêtes. Essayez à nouveau plus tard',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiteur);