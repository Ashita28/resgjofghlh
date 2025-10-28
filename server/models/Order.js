const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    // keep the reference to the product
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
    },

    // snapshot fields captured at order-time
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    qnt: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'Order must contain at least one item',
      },
    },

    // optional: derived totals
    tax: { type: Number, required: true, min: 0, default: 0 },
    delivery: { type: Number, required: true, min: 0, default: 0 },
    grandTotal: { type: Number, required: true, min: 0 },

    // optional status lifecycle
    status: {
      type: String,
      enum: ['pending','processing', 'done', 'pickup'],
      default: 'pending',
      index: true,
    },

    // optional notes / type
    orderType: { type: String, enum: ['dine-in', 'takeaway', 'delivery'], default: 'dine-in' },
    note: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
