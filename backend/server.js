require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectDB().catch((error) => {
  console.log("MongoDB connection failed:", error.message);
});
