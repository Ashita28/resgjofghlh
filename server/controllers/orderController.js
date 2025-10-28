const mongoose = require('mongoose');
const Order = require('../models/Order');
const Food = require('../models/Food');

// helper: compute grand total
const computeGrandTotal = (items, { tax = 0, delivery = 0 } = {}) => {
  const itemsTotal = items.reduce((sum, it) => sum + (it.price * it.qnt), 0);
  const gt = itemsTotal + Number(tax || 0) + Number(delivery || 0);
  return { itemsTotal, grandTotal: Math.max(0, gt) };
};

// POST /orders
const createOrder = async (req, res) => {
  try {
    const { user, items, orderType, note, tax = 0, delivery = 0 } = req.body ?? {};

    if (!user || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'user and items are required' });
    }

    // Validate items
    for (const it of items) {
      if (!it.food || typeof it.qnt === 'undefined') {
        return res.status(400).json({ error: 'Each item requires { food, qnt }' });
      }
      if (Number(it.qnt) <= 0) {
        return res.status(400).json({ error: 'Item quantity must be >= 1' });
      }
    }

    // Load foods to snapshot name/price
    const ids = items.map(i => i.food);
    const foods = await Food.find({ _id: { $in: ids } }).select('_id name price');
    if (foods.length !== items.length) {
      return res.status(400).json({ error: 'One or more food items not found' });
    }

    const map = new Map(foods.map(f => [String(f._id), f]));
    const lineItems = items.map(it => {
      const f = map.get(String(it.food));
      return { food: f._id, name: f.name, price: f.price, qnt: Number(it.qnt) };
    });

    const { grandTotal } = computeGrandTotal(lineItems, { tax, delivery });

    const order = await Order.create({
      user,
      items: lineItems,
      tax: Number(tax || 0),
      delivery: Number(delivery || 0),
      grandTotal,
      orderType,
      note,
    });

    const populated = await order
      .populate({ path: 'user', select: 'name contact' })
      .populate({ path: 'items.food', select: 'name avgPrepTime category' });

    return res.status(201).json({ message: 'Order created', order: populated });
  } catch (err) {
    console.error('createOrder:', err);
    if (err?.name === 'CastError') return res.status(400).json({ error: 'Invalid ObjectId provided' });
    if (err?.name === 'ValidationError') return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: 'Server error' });
  }
};

// GET /orders  (filters + pagination)
const allOrders = async (req, res) => {
  try {
    const { user, status, page = 1, limit = 20, sort = '-createdAt' } = req.query;

    const filter = {};
    if (user && mongoose.isValidObjectId(user)) filter.user = user;
    if (status) filter.status = status;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const lim = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort(sort)
        .skip((pageNum - 1) * lim)
        .limit(lim)
        .populate({ path: 'user', select: 'name contact' })
        .populate({ path: 'items.food', select: 'name avgPrepTime category' }),
      Order.countDocuments(filter),
    ]);

    return res.json({ total, page: pageNum, pages: Math.ceil(total / lim), orders });
  } catch (err) {
    console.error('allOrders:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// GET /orders/:id
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });

    const order = await Order.findById(id)
      .populate({ path: 'user', select: 'name contact' })
      .populate({ path: 'items.food', select: 'name avgPrepTime category' });

    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.json(order);
  } catch (err) {
    console.error('getOrder:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /orders/:id
const removeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });

    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Order not found' });

    return res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error('removeOrder:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createOrder, allOrders, getOrder, removeOrder };
