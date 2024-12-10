const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { paginationMiddleware } = require("./middlewares/middleware");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to the database
connectDB();

// Middleware for JSON parsing
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: "https://cuvette-xi.vercel.app",
    // origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests explicitly
app.options("*", cors());

// Routes
app.use("/api/admin", adminRoutes);
app.use(paginationMiddleware);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
