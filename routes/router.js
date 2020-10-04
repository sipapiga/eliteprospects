const express = require('express');
const router = express.Router();

const statRouter = require('./statRoute');
const teamRouter = require('./teamRoute');

router.use('/api/stats', statRouter);
router.use('/api/teams', teamRouter);

module.exports = router;
