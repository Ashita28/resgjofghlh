// routes/chefsRoutes.js
const express = require('express');
const { chefsData, updateChefsData, allChefs, getChef } = require('../controllers/chefsController');

const router = express.Router();

router.post('/chefs', chefsData);        // create (single or bulk)
router.patch('/chefs/assign', updateChefsData); // assign next order (or decrement if needed)
router.get('/chefs', allChefs);          // list
router.get('/chefs/:id', getChef);       // one

module.exports = router;
