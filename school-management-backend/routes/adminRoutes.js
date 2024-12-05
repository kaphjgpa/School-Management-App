const express = require("express");
const router = express.Router();
const zod = require("zod");
const { Admin } = require("../models/Admin");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { Class } = require("../models/Class");

// Signup Validation Schema
const signupBody = zod.object({
  userName: zod.string().email(),
  firstName: zod.string().min(1, "First name is required"),
  lastName: zod.string().min(1, "Last name is required"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
  contactNumber: zod.string(),
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
      contactNumber: req.body.contactNumber,
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

// Updating the Admin Details...
// Validate the Schema
const updateBody = zod.object({
  contactNumber: zod.string().optional(),
  password: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put("/update-details", async (req, res) => {
  try {
    // Validate the request body
    const validation = updateBody.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: validation.error.errors,
      });
    }

    // Authenticate the request (using JWT)
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Use the userName (or other unique field) from the request body to identify the admin
    const { userName } = req.body;
    if (!userName) {
      return res
        .status(400)
        .json({ message: "userName is required for updating details" });
    }

    // Find and update the student
    const updatedAdmin = await Admin.findOneAndUpdate(
      { userName }, // Find admin by userName
      { $set: req.body }, // Update with the fields in the request body
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Admin details updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("Error during update:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Mount Class here because Admin can only create classes
// Zod schema for request validation
const addClassBody = zod.object({
  className: zod.number(), // Adding validation for length
  startTime: zod.number().positive(), // Ensuring time is positive
  endTime: zod.number().positive(),
  teacherName: zod.string().min(3).max(255), // Corrected key to match the schema
  maxStudents: zod.number().int().positive(), // Ensure it's a positive integer
  studentFees: zod.number().int().positive(), // Corrected casing to match the schema
  year: zod.number().int().min(2024).max(2030), // Added range validation for year
});

router.post("/createclass", async (req, res) => {
  try {
    // Validate request body with Zod
    const validation = addClassBody.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: validation.error.errors,
      });
    }

    const { className } = req.body;

    // Check if the class already exists
    const existingClass = await Class.findOne({
      classname: className,
    });
    if (existingClass) {
      return res.status(409).json({
        message: "Class already exists",
      });
    }

    // Create the new class
    const createClass = await Class.create({
      className: req.body.className, // Ensure consistent casing
      startTime: req.body.startTime,
      endTime: req.body.endTime, // Corrected key to match the schema
      teacherName: req.body.teacherName, // Adjusted key to match the schema
      maxStudents: req.body.maxStudents,
      studentFees: req.body.studentFees, // Adjusted casing to match the schema
      year: req.body.year,
    });

    res.status(201).json({
      message: "Class created successfully",
      data: createClass,
    });
  } catch (error) {
    console.error("Error creating class:", error.message);
    res.status(500).json({
      message: "Failed to create class",
      error: error.message,
    });
  }
});

module.exports = router;
