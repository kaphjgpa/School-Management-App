const express = require("express");
const router = express.Router();
const zod = require("zod");
const { Admin } = require("../models/Admin");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const classRoutes = require("./classRoutes");

// Signup Validation Schema
const signupBody = zod.object({
  userName: zod.string().email(),
  firstName: zod.string().min(1, "First name is required"),
  lastName: zod.string().min(1, "Last name is required"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
});

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    // Validate the request body
    const validation = signupBody.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: validation.error.errors,
      });
    }

    // Check if the email is already registered
    const existingUser = await Admin.findOne({ userName: req.body.userName });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already taken",
      });
    }

    // Create a new administrator
    const admin = await Admin.create({
      userName: req.body.userName,
      password: req.body.password, // You should hash the password (see notes)
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    // Generate a JWT token
    const token = jwt.sign(
      { adminId: admin._id },
      JWT_SECRET,
      { expiresIn: "1h" } // Optional: Set token expiration
    );

    res.status(201).json({
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Signin Validation Schema
const signinBody = zod.object({
  userName: zod.string().email(),
  password: zod.string().min(6),
});

// Signin Route
router.post("/signin", async (req, res) => {
  try {
    // Validate the request body
    const validation = signinBody.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: validation.error.errors,
      });
    }

    // Authenticate the administrator
    const admin = await Admin.findOne({ userName: req.body.userName });
    if (!admin) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Validate the password (hash comparison recommended)
    if (admin.password !== req.body.password) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { adminId: admin._id },
      JWT_SECRET,
      { expiresIn: "1h" } // Optional: Set token expiration
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error("Error during signin:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Mount Class Routes
const app = express();
app.use("/classes", classRoutes);

module.exports = router;
