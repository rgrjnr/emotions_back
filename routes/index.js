const express = require('express');
const router = express.Router();

const sentiments = require('../routes/sentiments')
router.use('/sentiments', sentiments)


module.exports = router;