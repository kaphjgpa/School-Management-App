const express = require("express");
const router = express.Router();
const zod = require("zod");
const { Teacher } = require("../models/Teacher");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// Signup Validation Schema
const signupBody = zod.object({
  userName: zod.string().email(),
  teacherFirstName: zod.string(),
  teacherLastName: zod.string(),
  gender: zod.string(),
  dateOfBirth: zod.string(),
  salary: zod.number().min(5),
  contactNumber: zod.string(),
  password: zod.string().min(6, "Password must be at least 8 characters long"),
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
    const existingUser = await Teacher.findOne({
      userName: req.body.userName,
    });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already taken",
      });
    }

    // Create a new teacher account
    const teacher = await Teacher.create({
      userName: req.body.userName,
      teacherFirstName: req.body.teacherFirstName,
      teacherLastName: req.body.teacherLastName,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      contactNumber: req.body.contactNumber,
      salary: req.body.salary,
      password: req.body.password, // You should hash the password (see notes)
    });

    // Generate a JWT token
    const token = jwt.sign(
      { teacherId: teacher._id },
      JWT_SECRET,
      { expiresIn: "1h" } // Optional: Set token expiration
    );

    res.status(201).json({
      message: "Teacher created successfully",
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
  password: zod.string().min(8),
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

    // Authenticate the Teacher
    const teacher = await Teacher.findOne({ userName: req.body.userName });
    if (!teacher) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Validate the password (hash comparison recommended)
    if (teacher.password !== req.body.password) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { teacherId: teacher._id },
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

module.exports = router;
