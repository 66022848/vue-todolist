const express = require('express');
const router = express.Router();
const { getTaskCounts } = require('../controllers/tasksController');

router.get('/counts', getTaskCounts);

module.exports = router;