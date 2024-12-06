const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const {
  authMiddleware,
  paginationMiddleware,
} = require("./middlewares/middleware");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
// Apply middleware to all the possible routes, which starts from there 3 main routes
app.use(authMiddleware);

// Routes
app.use("/api/admin", adminRoutes);

// Applying paginationMiddleware to "students" and "teachers" routes
app.use(paginationMiddleware);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
