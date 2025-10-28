// routes/tableRoutes.js
const express = require('express');
const { createTable, allTables, delTable } = require('../controllers/tableController');

const router = express.Router();

router.post('/tables', createTable);
router.get('/tables', allTables);
router.delete('/tables/:id', delTable);

module.exports = router;
