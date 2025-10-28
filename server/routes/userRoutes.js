const express = require('express');
const { createUser, getUser, updateUser } = require('../controllers/userController');

const router = express.Router();

// Create
router.post('/users', createUser);

// Read (by id)
router.get('/users/:id', getUser);

// Update (partial)
router.patch('/users/:id', updateUser);
// Or full replace semantics if you prefer PUT:
// router.put('/users/:id', updateUser);

module.exports = router;
