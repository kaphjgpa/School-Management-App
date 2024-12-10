const express = require("express");
const router = express.Router();
const zod = require("zod");
const { Teacher } = require("../models/Teacher");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middlewares/middleware");
const bcrypt = require("bcryptjs");

// Signup Validation Schema
const signupBody = zod.object({
  userName: zod.string().email(),
  teacherFirstName: zod.string(),
  teacherLastName: zod.string(),
  gender: zod.string(),
  dateOfBirth: zod.string(),
  salary: zod.number().min(5),
  contactNumber: zod
    .number()
    .min(1000000000, "Contact number must be at least 10 digits"),
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
    const user = await Teacher.create({
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
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "12h" } // Optional: Set token expiration
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

//------------------------------------------------------------------------------

// Signin Validation Schema
const signinBodySchema = zod.object({
  userName: zod.string().email(),
  password: zod.string().min(8),
});

// Signin Route
router.post("/signin", async (req, res) => {
  try {
    // Validate request body
    const validation = signinBodySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.error.errors.map((err) => err.message),
      });
    }

    const { userName, password } = req.body;

    // Check if user exists
    const user = await Teacher.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, userName: user.userName },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    // Respond with success
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        role: user.role || "teacher", // Include user role if applicable
      },
    });
  } catch (error) {
    console.error("Error during sign-in:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Updating the Teacher Details...
// Update Validation Schema
const updateBody = zod.object({
  teacherLastName: zod.string().optional(),
  contactNumber: zod.number().optional(),
  password: zod.string().min(6).optional(),
});

router.put("/update-details", authMiddleware, async (req, res) => {
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
    const { userName, password, ...otherUpdates } = req.body; // Extract password separately
    if (!userName) {
      return res
        .status(400)
        .json({ message: "userName is required for updating details" });
    }

    // Hash the password if it's present in the request body
    let updatedFields = { ...otherUpdates }; // All other updates
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }

    // Find and update the teacher
    const updatedTeacher = await Teacher.findOneAndUpdate(
      { userName }, // Find teacher by userName
      { $set: updatedFields }, // Update with the fields in the request body
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

//------------------------------------------------------------------------------------------------

// Deleting a teacher
router.delete("/delete-teacher/:userName", async (req, res) => {
  try {
    const userName = req.params.userName;

    // Find and delete the student by userName
    const deletedTeacher = await Teacher.findOneAndDelete({ userName });

    if (!deletedTeacher) {
      return res
        .status(404)
        .json({ message: "Teacher not found with the given userName" });
    }

    res.status(200).json({
      message: "Teacher profile deleted successfully",
      teacher: deletedTeacher,
    });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({
      message: "An error occurred while deleting the student profile",
    });
  }
});

module.exports = router;
