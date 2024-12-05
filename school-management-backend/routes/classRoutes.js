const express = require("express");
const router = express.Router();
const zod = require("zod");
const { Class } = require("../models/Class");

// Zod schema for request validation
const addClassBody = zod.object({
  className: zod.string().min(3).max(255), // Adding validation for length
  startTime: zod.number().positive(), // Ensuring time is positive
  endTime: zod.number().positive(),
  teacherName: zod.string().min(3).max(255), // Corrected key to match the schema
  maxStudents: zod.number().int().positive(), // Ensure it's a positive integer
  studentFees: zod.number().positive(), // Corrected casing to match the schema
  year: zod.number().int().min(1).max(12), // Added range validation for year
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
      classname: className.toLowerCase(),
    });
    if (existingClass) {
      return res.status(409).json({
        message: "Class already exists",
      });
    }

    // Create the new class
    const createClass = await Class.create({
      classname: req.body.className.toLowerCase(), // Ensure consistent casing
      startTime: req.body.startTime,
      endTime: req.body.endTime, // Corrected key to match the schema
      teacherName: req.body.teacherName, // Adjusted key to match the schema
      maxStudents: req.body.maxStudents,
      studentfees: req.body.studentFees, // Adjusted casing to match the schema
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
