const express = require('express');
const router = express.Router();

const statRouter = require('./statRoute');

router.use('/api/stats', statRouter);

module.exports = router;
