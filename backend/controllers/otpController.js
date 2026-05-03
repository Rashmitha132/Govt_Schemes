const otpStore = new Map();
const OTP_TTL_MS = 5 * 60 * 1000;
const SHOW_DEMO_OTP = process.env.SHOW_DEMO_OTP !== "false";

const normalizePhone = (phone) => String(phone || "").replace(/\D/g, "").slice(-10);

const generateOtp = () => String(Math.floor(1000 + Math.random() * 9000));

const requestOtp = (req, res) => {
  const phone = normalizePhone(req.body.phone);
  const language = req.body.language || "hi";

  if (phone.length !== 10) {
    return res.status(400).json({ success: false, message: "Valid 10 digit mobile number is required" });
  }

  const otp = generateOtp();
  otpStore.set(phone, {
    otp,
    language,
    expiresAt: Date.now() + OTP_TTL_MS,
  });

  console.log(`Demo OTP for +91${phone}: ${otp}`);

  return res.json({
    success: true,
    otp,
    message: SHOW_DEMO_OTP
      ? "Demo OTP generated. Use the OTP shown on screen."
      : "OTP sent successfully",
    demoOtp: SHOW_DEMO_OTP ? otp : undefined,
    expiresInSeconds: OTP_TTL_MS / 1000,
  });
};

const verifyOtp = (req, res) => {
  const phone = normalizePhone(req.body.phone);
  const otp = String(req.body.otp || "").replace(/\D/g, "");
  const savedOtp = otpStore.get(phone);

  if (!savedOtp) {
    return res.status(400).json({ success: false, message: "OTP not found. Please request a new OTP" });
  }

  if (Date.now() > savedOtp.expiresAt) {
    otpStore.delete(phone);
    return res.status(400).json({ success: false, message: "OTP expired. Please request a new OTP" });
  }

  if (savedOtp.otp !== otp) {
    return res.status(401).json({ success: false, message: "Invalid OTP" });
  }

  otpStore.delete(phone);

  return res.json({
    success: true,
    message: "Login verified successfully",
    user: {
      phone: `+91${phone}`,
      loginMethod: "otp",
    },
  });
};

const missedCallLogin = (req, res) => {
  const phone = normalizePhone(req.body.phone);
  const language = req.body.language || "hi";

  if (phone.length !== 10) {
    return res.status(400).json({ success: false, message: "Valid 10 digit mobile number is required" });
  }

  return res.json({
    success: true,
    message: "Missed call login request received",
    language,
    callbackNumber: "+91 90000 00000",
  });
};

module.exports = {
  missedCallLogin,
  requestOtp,
  verifyOtp,
};
