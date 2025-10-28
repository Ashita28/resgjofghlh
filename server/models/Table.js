// models/Table.js
const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableName: {
    type: String,
    trim: true,
    default: function () {
      return this.tableNum ? `T-${this.tableNum}` : undefined;
    }
  },

  tableNum: {
    type: Number,
    required: true,
    min: 1,
    unique: true,           // ✅ recommend uniqueness
    index: true
  },

  chairs: {
    type: Number,
    required: true,
    min: 1
  }

  // (for future assignment)
  // isOccupied: { type: Boolean, default: false },
  // currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null }
}, {timestamps: true});

module.exports = mongoose.model("Table", tableSchema);
