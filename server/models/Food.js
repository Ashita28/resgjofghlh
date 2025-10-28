const mongoose = require("mongoose");

const isUrl = (v) => {
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
};

const foodSchema = new mongoose.Schema(
  {
    itemImage: {
      type: String,
      required: true,
      trim: true,
      validate: { validator: isUrl, message: "itemImage must be a valid URL" },
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },

    price: {
      type: Number,
      required: true,
      min: [0, "price cannot be negative"],
    },

    // minutes
    avgPrepTime: {
      type: Number,
      required: true,
      min: [0, "avgPrepTime must be >= 0"],
    },

    category: {
      type: String,
      required: true,
      trim: true,
      // uncomment if you have fixed categories:
      // enum: ["starter", "main", "dessert", "beverage", "snack"],
    },

    stock: {
      type: Boolean,
      required: true,
      default: true,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: null, // optional
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);
