const express = require("express");
const router = express.Router();
const zod = require("zod");
const { Admin } = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../config");
const { Class } = require("../models/Class");
const { Student } = require("../models/Student");
const { Teacher } = require("../models/Teacher");
const {
  authMiddleware,
  paginationMiddleware,
} = require("../middlewares/middleware");

// Signup Validation Schema
const signupBody = zod.object({
  userName: zod.string().email(),
  firstName: zod.string().min(1, "First name is required"),
  lastName: zod.string().min(1, "Last name is required"),
  gender: zod.string(),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
  contactNumber: zod
    .number()
    .min(1000000000, "Contact number must be at least 10 digits"), // Ensure a valid phone number
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

    // Check if an admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(403).json({
        message:
          "An admin account already exists. Multiple admin accounts are not allowed.",
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
    const user = await Admin.create({
      userName: req.body.userName,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      contactNumber: req.body.contactNumber,
    });

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "12h" } // Optional: Set token expiration
    );

    res.status(201).json({
      message: "Admin account created successfully",
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

//------------------------------------------------------------------------------------------------

// Signin Validation Schema (using Zod)
const signinBody = zod.object({
  userName: zod.string().email(), // Ensure valid email format for username
  password: zod.string().min(8), // Minimum length for password
});

// Signin Route
router.post("/signin", async (req, res) => {
  try {
    // Validate the request body using Zod
    const validation = signinBody.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: validation.error.errors,
      });
    }

    // Authenticate the administrator by userName (email)
    const user = await Admin.findOne({ userName: req.body.userName });
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

    // Generate a JWT token after successful authentication
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET, // Replace with your actual JWT secret
      { expiresIn: "12h" } // Optional: Set token expiration time
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
//------------------------------------------------------------------------------------------

// Updating the Admin Details...
// Validate the Schema
const updateBody = zod.object({
  contactNumber: zod.string().optional(),
  password: zod.string().optional(),
  lastName: zod.string().optional(),
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

    // Find and update the admin
    const updatedAdmin = await Admin.findOneAndUpdate(
      { userName }, // Find admin by userName
      { $set: updatedFields }, // Update with the fields in the request body
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Admin details updated successfully",
      user: updatedAdmin,
    });
  } catch (error) {
    console.error("Error during update:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});
//------------------------------------------------------------------------------------------------

// Mount Class here because Admin can only create classes
// Zod schema for request validation
const addClassBody = zod.object({
  className: zod.string(),
  teacherName: zod.string().min(3).max(255),
  maxStudents: zod.number().int().positive().min(30).max(30),
  studentsFees: zod.number().int().positive(),
  year: zod.number().int().min(2024).max(2030),
});

router.post("/create-class", authMiddleware, async (req, res) => {
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
      className: { $regex: new RegExp(`^${className}$`, "i") }, // It check for the case sensitive like :- "One" or "one"
    });
    if (existingClass) {
      return res.status(409).json({
        message: "Class already exists",
      });
    }

    // Create the new class
    const createClass = await Class.create({
      className: req.body.className,
      teacherName: req.body.teacherName,
      maxStudents: req.body.maxStudents,
      studentsFees: req.body.studentsFees,
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

//------------------------------------------------------------------------------------------------

// Updating the Class Details...
// Validate the Schema
const updateClass = zod.object({
  year: zod.number().optional(),
  studentsFees: zod.number().optional(),
  teacherName: zod.string().optional(),
});

router.put("/update-class", authMiddleware, async (req, res) => {
  try {
    // Validate the request body
    const validation = updateClass.safeParse(req.body);
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

    // Use the className (or other unique field) from the request body to identify the admin and Updating the classes
    const { className } = req.body;
    if (!className) {
      return res
        .status(400)
        .json({ message: "className is required for updating details" });
    }

    // Find and update the class
    const updatedClass = await Class.findOneAndUpdate(
      { className }, // Find admin by className
      { $set: req.body }, // Update with the fields in the request body
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({
      message: "Class details updated successfully",
      admin: updatedClass,
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

//This is the search logic behind classes
router.get("/search-class", paginationMiddleware, async (req, res) => {
  try {
    const filter = req.query.filter || ""; // Default to an empty string

    // Search with regex for className or teacherName
    const classes = await Class.find({
      $or: [
        {
          className: {
            $regex: filter,
            $options: "i", // Case-insensitive search
          },
        },
        {
          teacherName: {
            $regex: filter,
            $options: "i", // Case-insensitive search
          },
        },
      ],
    });

    // Respond with formatted data
    res.json({
      classes: classes.map((classItem) => ({
        className: classItem.className,
        teacherName: classItem.teacherName,
        studentFees: classItem.studentsFees,
        maxStudents: classItem.maxStudents,
        year: classItem.year,
        _id: classItem._id,
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

//--------------------------------------------------------------------------------------------------------------------

//Students search here, it is almost the same as class search

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
            $options: "i",
          },
        },
        {
          studentLastName: {
            $regex: filter,
            $options: "i",
          },
        },
        {
          gender: {
            $regex: filter,
            $options: "i",
          },
        },
      ],
    });

    // Respond with formatted data
    res.json({
      students: students.map((studentsItems) => ({
        studentFirstName: studentsItems.studentFirstName,
        studentLastName: studentsItems.studentLastName,
        gender: studentsItems.gender,
        contactNumber: studentsItems.contactNumber,
        feesPaid: studentsItems.feesPaid,
        dateOfBirth: studentsItems.dateOfBirth,
        userName: studentsItems.userName,
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

//--------------------------------------------------------------------------------------------------------------------

// Assigned classes to the
// Update Validation Schema
const assignClassBody = zod.object({
  assignedClass: zod.string(),
});

router.put("/assign-class", async (req, res) => {
  try {
    // Validate the request body
    const validation = assignClassBody.safeParse(req.body);
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
    const { teacherFirstName } = req.body;
    if (!teacherFirstName) {
      return res
        .status(400)
        .json({ message: "userName is required for updating details" });
    }

    // Find and update the teacher
    const updatedTeacherClass = await Teacher.findOneAndUpdate(
      { teacherFirstName }, // Find teacher by userName
      { $set: req.body }, // Update with the fields in the request body
      { new: true, runValidators: true }
    );

    if (!updatedTeacherClass) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({
      message: "Teacher details updated successfully",
      teacher: updatedTeacherClass,
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

//Teacher search here, it is almost the same as class and student search

router.get("/search-teacher", async (req, res) => {
  try {
    const filter = req.query.filter || "";

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
        salary: teachersItems.salary,
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

//--------------------------------------------------------------------------------------------------------------------
//Deleting class from DB

router.delete("/delete-class/:className", async (req, res) => {
  try {
    const className = req.params.className;

    // Find and delete the student by userName
    const deletedClass = await Class.findOneAndDelete({ className });

    if (!deletedClass) {
      return res
        .status(404)
        .json({ message: "Teacher not found with the given userName" });
    }

    res.status(200).json({
      message: "Class profile deleted successfully",
      student: deletedClass,
    });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({
      message: "An error occurred while deleting the class",
    });
  }
});

module.exports = router;
