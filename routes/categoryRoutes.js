// File: routes/categoryRoutes.js
const express = require("express");

const { getCategories, selectCategory } = require("../controllers/categoryController");

const router = express.Router();

router.get("/", getCategories);
router.post("/select", selectCategory);

module.exports = router;
