const path = require("path");

const cors = require("cors");
const express = require("express");

const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

const app = express();
const frontendPublicPath = path.join(__dirname, "..", "frontend", "public");

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", otpRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api", applicationRoutes);
app.use("/api", recommendationRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPublicPath, "kisaan-login.html"));
});

app.get("/questions", (req, res) => {
  res.sendFile(path.join(frontendPublicPath, "questions.html"));
});

app.get("/apply-assistant/:schemeId", (req, res) => {
  res.sendFile(path.join(frontendPublicPath, "apply-assistant.html"));
});

app.use(express.static(frontendPublicPath));

module.exports = app;
