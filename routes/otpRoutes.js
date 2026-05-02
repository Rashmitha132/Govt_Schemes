const express = require("express");

const { missedCallLogin, requestOtp, verifyOtp } = require("../controllers/otpController");

const router = express.Router();

router.post("/otp/request", requestOtp);
router.post("/otp/verify", verifyOtp);
router.post("/missed-call-login", missedCallLogin);

module.exports = router;
