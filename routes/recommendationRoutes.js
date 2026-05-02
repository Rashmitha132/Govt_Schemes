const express = require("express");

const { recommendSchemes } = require("../controllers/recommendationController");

const router = express.Router();

router.post("/recommend-schemes", recommendSchemes);

module.exports = router;
