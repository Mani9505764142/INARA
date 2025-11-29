// server.js
require("dotenv").config();
const connectDB = require("./src/config/db");
const app = require("./src/app");

// Connect DB
connectDB();

const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || "development";

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${ENV} mode on port ${PORT}`);
});
