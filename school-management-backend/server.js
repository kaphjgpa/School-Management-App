const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

//middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/classes", require("./routes/classRoutes"));
app.use("/api/teaxhers", require("./routes/teacherRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));

//Error Handling Middleware
app.use(require("./middlewares/errorHandler"));

//Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
