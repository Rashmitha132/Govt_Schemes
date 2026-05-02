const path = require("path");

const cors = require("cors");
const express = require("express");

const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

const app = express();

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
  res.sendFile(path.join(__dirname, "public", "kisaan-login.html"));
});

app.get("/questions", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "questions.html"));
});

app.get("/apply-assistant/:schemeId", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "apply-assistant.html"));
});

app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
