const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
    unique: true, // Ensures no duplicate usernames
  },
  studentFirstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
  },
  studentLastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  contactNumber: {
    type: String, // String to allow length validation
    required: true,
    trim: true,
    match: [/^\d{10}$/, "Contact number must be a valid 10-digit number"],
  },
  feesPaid: {
    type: Number,
    required: true,
    min: 1000,
    max: 12000,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
});

// Hash password before saving the document
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Student = mongoose.model("Student", studentSchema);

module.exports = {
  Student,
};
