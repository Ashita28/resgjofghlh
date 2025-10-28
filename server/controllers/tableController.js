// controllers/tableController.js
const mongoose = require('mongoose');
const Table = require('../models/Table');

// POST /tables  (create one or many)
const createTable = async (req, res) => {
  try {
    const payload = req.body;

    if (!payload || (Array.isArray(payload) && payload.length === 0)) {
      return res.status(400).json({ error: 'Provide table data' });
    }

    const arr = Array.isArray(payload) ? payload : [payload];

    for (const t of arr) {
      if (typeof t.tableNum === 'undefined') {
        return res.status(400).json({ error: 'tableNum is required' });
      }
      if (typeof t.chairs === 'undefined') {
        return res.status(400).json({ error: 'chairs is required' });
      }
      if (!t.tableName && typeof t.tableNum !== 'undefined') {
        t.tableName = `T-${t.tableNum}`;
      }
    }

    const nums = arr.map(a => a.tableNum);
    const existing = await Table.find({ tableNum: { $in: nums } }).select('tableNum');
    if (existing.length) {
      const taken = existing.map(e => e.tableNum).join(', ');
      return res.status(409).json({ error: `Table(s) already exist with tableNum: ${taken}` });
    }

    const created = await Table.insertMany(arr, { ordered: true });
    return res.status(201).json({ message: 'Table(s) created', tables: created });
  } catch (err) {
    console.error('createTable:', err);
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Duplicate tableNum' });
    }
    if (err?.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};

// GET /tables (list with filters + pagination)
const allTables = async (req, res) => {
  try {
    const {
      q,            // search in tableName
      minChairs,    // >= min
      maxChairs,    // <= max
      page = 1,
      limit = 50,
      sort = 'tableNum', // default ascending by tableNum
      dir = 'asc',
    } = req.query;

    const filter = {};
    if (q) filter.tableName = { $regex: q, $options: 'i' };
    if (typeof minChairs !== 'undefined' || typeof maxChairs !== 'undefined') {
      filter.chairs = {};
      if (typeof minChairs !== 'undefined') filter.chairs.$gte = Number(minChairs);
      if (typeof maxChairs !== 'undefined') filter.chairs.$lte = Number(maxChairs);
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const lim = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const dirNum = dir === 'desc' ? -1 : 1;

    const [items, total] = await Promise.all([
      Table.find(filter)
        .sort({ [sort]: dirNum, updatedAt: -1 })
        .skip((pageNum - 1) * lim)
        .limit(lim),
      Table.countDocuments(filter),
    ]);

    return res.json({
      total,
      page: pageNum,
      pages: Math.ceil(total / lim),
      items,
    });
  } catch (err) {
    console.error('allTables:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /tables/:id   (delete by Mongo _id) OR ?byNum=NN
const delTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { byNum } = req.query;

    let deleted;
    if (typeof byNum !== 'undefined') {
      deleted = await Table.findOneAndDelete({ tableNum: Number(byNum) });
    } else {
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid id' });
      }
      deleted = await Table.findByIdAndDelete(id);
    }

    if (!deleted) return res.status(404).json({ error: 'Table not found' });
    return res.json({ message: 'Table deleted' });
  } catch (err) {
    console.error('delTable:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createTable, allTables, delTable };
