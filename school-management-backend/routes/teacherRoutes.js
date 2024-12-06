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

// Updating the Teacher Details...
// Update Validation Schema
const updateBody = zod.object({
  teacherLastName: zod.string().optional(),
  contactNumber: zod.string().optional(),
  password: zod.string().min(6).optional(),
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

    // Use the userName (or other unique field) from the request body to identify the teacher
    const { userName } = req.body;
    if (!userName) {
      return res
        .status(400)
        .json({ message: "userName is required for updating details" });
    }

    // Find and update the teacher
    const updatedTeacher = await Teacher.findOneAndUpdate(
      { userName }, // Find teacher by userName
      { $set: req.body }, // Update with the fields in the request body
      { new: true, runValidators: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({
      message: "Teacher details updated successfully",
      teacher: updatedTeacher,
    });
  } catch (error) {
    console.error("Error during update:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

//--------------------------------------------------------------------------------------------------------------------
// Search for teachers

router.get("/search-teacher", async (req, res) => {
  try {
    const filter = req.query.filter || ""; // Default to an empty string

    // Search with regex for className or teacherName
    const teachers = await Teacher.find({
      $or: [
        {
          userName: {
            $regex: filter,
            $options: "i", // Case-insensitive search
          },
        },
        {
          teacherFirstName: {
            $regex: filter,
            $options: "i", // Case-insensitive search
          },
        },
        {
          teacherLastName: {
            $regex: filter,
            $options: "i", // Case-insensitive search
          },
        },
        {
          gender: {
            $regex: filter,
            $options: "i", // Case-insensitive search
          },
        },
      ],
    });

    // Respond with formatted data
    res.json({
      teachers: teachers.map((teachersItems) => ({
        userName: teachersItems.userName,
        teacherFirstName: teachersItems.teacherFirstName,
        teacherLastName: teachersItems.teacherLastName,
        gender: teachersItems.gender,
        contactNumber: teachersItems.contactNumber,
        //Removing salary information
        dateOfBirth: teachersItems.dateOfBirth,
        // for privacy reasons I don't want to show password
        _id: teachersItems._id,
      })),
    });
  } catch (error) {
    console.error("Error during search:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
