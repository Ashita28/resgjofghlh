// seedFoods.js
require('dotenv').config();
const mongoose = require('mongoose');
const Food = require('./models/Food');

const MONGO_URI = process.env.MONGO_URI;

const foods = [
  // 🍔 Burgers
  {
    itemImage: 'https://images.unsplash.com/photo-1606755962773-0c2f8f5a8a56',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheese, lettuce, tomato, and special sauce.',
    price: 199,
    avgPrepTime: 15,
    category: 'burger',
    stock: true,
    rating: 4.6,
  },
  {
    itemImage: 'https://images.unsplash.com/photo-1605475128023-95b0cbe3b66d',
    name: 'BBQ Bacon Burger',
    description: 'Grilled beef with BBQ sauce, crispy bacon, and cheddar cheese.',
    price: 249,
    avgPrepTime: 18,
    category: 'burger',
    stock: true,
    rating: 4.7,
  },
  {
    itemImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
    name: 'Veggie Delight Burger',
    description: 'Loaded with grilled vegetables and creamy mayo on a whole-grain bun.',
    price: 179,
    avgPrepTime: 14,
    category: 'burger',
    stock: true,
    rating: 4.2,
  },
  {
    itemImage: 'https://images.unsplash.com/photo-1601050690597-2bbbe8c3a6d0',
    name: 'Double Patty Smash',
    description: 'Two stacked patties, caramelized onions, and melted cheese.',
    price: 299,
    avgPrepTime: 20,
    category: 'burger',
    stock: true,
    rating: 4.8,
  },
  {
    itemImage: 'https://images.unsplash.com/photo-1625941927264-d0f81b14d845',
    name: 'Spicy Chicken Burger',
    description: 'Crispy chicken fillet with spicy mayo and lettuce.',
    price: 229,
    avgPrepTime: 16,
    category: 'burger',
    stock: true,
    rating: 4.5,
  },

  // 🍕 Pizzas
  {
    itemImage: 'https://images.unsplash.com/photo-1601924582971-df8f89f8cf5a',
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza topped with mozzarella and basil.',
    price: 299,
    avgPrepTime: 20,
    category: 'pizza',
    stock: true,
    rating: 4.8,
  },
  {
    itemImage: 'https://images.unsplash.com/photo-1612197527762-8a989e40ef19',
    name: 'Pepperoni Feast',
    description: 'Loaded with double pepperoni and mozzarella cheese.',
    price: 349,
    avgPrepTime: 22,
    category: 'pizza',
    stock: true,
    rating: 4.9,
  },
  {
    itemImage: 'https://images.unsplash.com/photo-1601924582971-df8f89f8cf5a',
    name: 'Veggie Overload',
    description: 'Bell peppers, olives, onions, and mushrooms on tomato sauce.',
    price: 329,
    avgPrepTime: 18,
    category: 'pizza',
    stock: true,
    rating: 4.4,
  },
  {
    itemImage: 'https://images.unsplash.com/photo-1585238341986-84e9f2f23f3f',
    name: 'Farmhouse Special',
    description: 'Loaded with fresh vegetables and cheese burst crust.',
    price: 379,
    avgPrepTime: 20,
    category: 'pizza',
    stock: true,
    rating: 4.6,
  },
  {
    itemImage: 'https://images.unsplash.com/photo-1621342832587-52c53fdbd640',
    name: 'Paneer Tikka Pizza',
    description: 'Indian-style paneer chunks with spiced sauce and cheese.',
    price: 339,
    avgPrepTime: 19,
    category: 'pizza',
    stock: true,
    rating: 4.7,
  },

  // 🍟 Fries
  {
    itemImage: 'https://images.unsplash.com/photo-1601924582971-df8f89f8cf5a',
    name: 'Classic Salted Fries',
    description: 'Golden crisp french fries sprinkled with rock salt.',
    price: 99,
    avgPrepTime: 10,
    category: 'fries',
    stock: true,
    rating: 4.3,
  },
  {
    itemImage: 'https://images.unsplash.com/photo-1605475128023-95b0cbe3b66d',
    name: 'Peri Peri Fries',
    description: 'Crispy fries tossed in spicy peri-peri seasoning.',
    price: 119,
    avgPrepTime: 10,
    category: 'fries',
    stock: true,
    rating: 4.6,
  },
  {
    itemImage: 'https://images.unsplash.com/photo-1605475128023-95b0cbe3b66d',
    name: 'Cheese Loaded Fries',
    description: 'Fries topped with hot cheese sauce and herbs.',
    price: 149,
    avgPrepTime: 12,
    category: 'fries',
    stock: true,
    rating: 4.7,
  },

  // 🥤 Drinks
  {
    itemImage: 'https://images.unsplash.com/photo-1551024601-bec78aea704b',
    name: 'Cold Coffee',
    description: 'Rich iced coffee topped with whipped cream.',
    price: 139,
    avgPrepTime: 6,
    category: 'drinks',
    stock: true,
    rating: 4.5,
  },
  {
    itemImage: 'https://images.unsplash.com/photo-1564849444446-f876dcef378e',
    name: 'Lemon Iced Tea',
    description: 'Refreshing lemon iced tea served chilled.',
    price: 99,
    avgPrepTime: 5,
    category: 'drinks',
    stock: true,
    rating: 4.3,
  },
  {
    itemImage: 'https://images.unsplash.com/photo-1576402187878-974f70d6a0f3',
    name: 'Berry Smoothie',
    description: 'Mixed berries blended with yogurt and honey.',
    price: 149,
    avgPrepTime: 7,
    category: 'drinks',
    stock: true,
    rating: 4.8,
  },

  // 🥦 Veggies
  {
    itemImage: 'https://images.unsplash.com/photo-1601050690597-2bbbe8c3a6d0',
    name: 'Grilled Veg Salad',
    description: 'Assorted grilled vegetables with balsamic dressing.',
    price: 179,
    avgPrepTime: 8,
    category: 'veggies',
    stock: true,
    rating: 4.2,
  },
  {
    itemImage: 'https://images.unsplash.com/photo-1615470933969-7ef6baf67e44',
    name: 'Sauteed Broccoli',
    description: 'Lightly seasoned broccoli stir-fried in olive oil.',
    price: 129,
    avgPrepTime: 6,
    category: 'veggies',
    stock: true,
    rating: 4.4,
  },

  // 🍰 Desserts
  {
    itemImage: 'https://images.unsplash.com/photo-1608571423903-021b3f8ecca1',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center.',
    price: 179,
    avgPrepTime: 10,
    category: 'desserts',
    stock: true,
    rating: 4.9,
  },
  {
    itemImage: 'https://images.unsplash.com/photo-1590080875831-b6b2c39d89a0',
    name: 'Vanilla Ice Cream',
    description: 'Classic vanilla scoop made with real cream.',
    price: 99,
    avgPrepTime: 5,
    category: 'desserts',
    stock: true,
    rating: 4.7,
  },

  // 🥪 Sandwiches
  {
    itemImage: 'https://images.unsplash.com/photo-1585238341986-84e9f2f23f3f',
    name: 'Grilled Cheese Sandwich',
    description: 'Butter-grilled sandwich with melting cheese inside.',
    price: 149,
    avgPrepTime: 8,
    category: 'sandwiches',
    stock: true,
    rating: 4.5,
  },
  {
    itemImage: 'https://images.unsplash.com/photo-1590080875831-b6b2c39d89a0',
    name: 'Paneer Tikka Sandwich',
    description: 'Spicy paneer cubes grilled inside multigrain bread.',
    price: 169,
    avgPrepTime: 10,
    category: 'sandwiches',
    stock: true,
    rating: 4.6,
  },
];

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await Food.deleteMany({});
    const inserted = await Food.insertMany(foods);
    console.log(`✅ Inserted ${inserted.length} food items.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
})();
