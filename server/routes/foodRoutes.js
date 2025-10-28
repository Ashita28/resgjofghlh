const express = require("express");
const { createFood, getFood, updateFood, delFood } = require("../controllers/foodController");

const router = express.Router();

router.post("/foods", createFood);   // create
router.get("/foods", getFood);       // list (+ filters/pagination)
router.patch("/foods/:id", updateFood); // update
router.delete("/foods/:id", delFood);   // delete

module.exports = router;
