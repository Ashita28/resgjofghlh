const express = require('express');
const { createOrder, allOrders, getOrder, removeOrder } = require('../controllers/orderController');

const router = express.Router();

router.post('/orders', createOrder);
router.get('/orders', allOrders);
router.get('/orders/:id', getOrder);
router.delete('/orders/:id', removeOrder);

module.exports = router;
