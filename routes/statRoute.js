const express = require('express');
const router = express.Router();
const statController = require('../controllers/stat');

router.get('/:year', statController.getStatsFilterByYear);

module.exports = router;
