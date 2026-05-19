require("dotenv").config({ override: true });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const historyRoutes = require("./routes/historyRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/admin", adminRoutes);

app.use("/csv", express.static("csv"));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use((err, req, res, next) => {
  console.error("EXPRESS ERROR:", err);
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }

};

startServer();
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");

// const authRoutes = require("./routes/authRoutes");
// const testRoutes = require("./routes/testRoutes");
// const uploadRoutes = require("./routes/uploadRoutes");
// const historyRoutes = require("./routes/historyRoutes");
// const adminRoutes = require("./routes/adminRoutes");

// // DEBUG: Check which one is not a function
// console.log("authRoutes:", typeof authRoutes);
// console.log("testRoutes:", typeof testRoutes);
// console.log("uploadRoutes:", typeof uploadRoutes);
// console.log("historyRoutes:", typeof historyRoutes);
// console.log("adminRoutes:", typeof adminRoutes);