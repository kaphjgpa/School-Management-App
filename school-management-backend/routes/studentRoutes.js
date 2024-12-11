const express = require("express");
const router = express.Router();
const zod = require("zod");
const { Student } = require("../models/Student");
const { Class } = require("../models/Class");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../config");

// Signup Validation Schema
const signupBody = zod.object({
  userName: zod.string().email(),
  studentFirstName: zod.string(),
  studentLastName: zod.string(),
  gender: zod.string(),
  dateOfBirth: zod.string(),
  feesPaid: zod.number().min(5),
  contactNumber: zod.number().min(10),
  password: zod.string().min(8, "Password must be at least 8 characters long"),
  className: zod.string(),
});
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
    const existingUser = await Student.findOne({
      userName: req.body.userName,
    });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already taken",
      });
    }

    // Find the class by className
    const classDocument = await Class.findOne({
      className: req.body.className,
    });

    // If no class is found, return an error
    if (!classDocument) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    // Check if the class has reached the max number of students
    if (classDocument.currentStudents >= classDocument.maxStudents) {
      return res.status(400).json({
        message: "This class has reached its maximum student limit.",
      });
    }

    // Increment the currentStudents in the Class document
    classDocument.currentStudents += 1;

    const fullName = `${req.body.studentFirstName} ${req.body.studentLastName}`;

    // Add the student to the class' studentList (ensure no duplicates)
    classDocument.studentList.addToSet(fullName); // You can also add user ID instead of username
    await classDocument.save();

    // Create a new Student account and assign the class
    const user = await Student.create({
      userName: req.body.userName,
      studentFirstName: req.body.studentFirstName,
      studentLastName: req.body.studentLastName,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      contactNumber: req.body.contactNumber,
      feesPaid: req.body.feesPaid,
      password: req.body.password, // You should hash the password here (see note below)
      className: classDocument._id, // Assign the class ObjectId to the student
    });

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "12h" } // Optional: Set token expiration
    );

    res.status(201).json({
      message: "Student created successfully",
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

module.exports = router;

// Signin Validation Schema
const signinBody = zod.object({
  userName: zod.string().email(),
  password: zod.string().min(8),
});

//--------------------------------------------------------------------------------------------------------------------

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

    // Authenticate the Student
    const user = await Student.findOne({ userName: req.body.userName });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Validate the password by comparing the plain-text password with the hashed password
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "12h" } // Optional: Set token expiration
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
//--------------------------------------------------------------------------------------------------------------------

// Updating the Student Details...
// Validate the Schema
const updateBody = zod.object({
  contactNumber: zod.number().optional(),
  password: zod.string().optional(),
  feesPaid: zod.number().optional(),
  studentLastName: zod.string().optional(),
  class: zod.number().optional(),
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

    // Use the userName (or other unique field) from the request body to identify the student
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

    // Find and update the student
    const updatedStudent = await Student.findOneAndUpdate(
      { userName }, // Find student by userName
      { $set: updatedFields }, // Update with the fields in the request body
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student details updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error during update:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

//------------------------------------------------------------------------------------------------------------------------------

// Search added in the student Router

router.get("/search-student", async (req, res) => {
  try {
    const filter = req.query.filter || ""; // Default to an empty string

    // Search with regex for className or teacherName
    const students = await Student.find({
      $or: [
        {
          userName: {
            $regex: filter,
            $options: "i", // Case-insensitive search
          },
        },
        {
          studentFirstName: {
            $regex: filter,
            $options: "i", // Case-insensitive search
          },
        },
        {
          studentLastName: {
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
      students: students.map((studentsItems) => ({
        userName: studentsItems.userName,
        studentFirstName: studentsItems.studentFirstName,
        studentLastName: studentsItems.studentLastName,
        gender: studentsItems.gender,
        contactNumber: studentsItems.contactNumber,
        // feesPaid: studentsItems.feesPaid,
        dateOfBirth: studentsItems.dateOfBirth,
        // for privacy reasons I don't want to show password
        _id: studentsItems._id,
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

router.delete("/delete-student/:userName", async (req, res) => {
  try {
    const userName = req.params.userName;

    // Find and delete the student by userName
    const deletedStudent = await Student.findOneAndDelete({ userName });

    if (!deletedStudent) {
      return res
        .status(404)
        .json({ message: "Student not found with the given userName" });
    }

    res.status(200).json({
      message: "Student profile deleted successfully",
      student: deletedStudent,
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      message: "An error occurred while deleting the student profile",
    });
  }
});

module.exports = router;
