const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
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
    min: 1,
    max: 12,
  },
  dateOfBirth: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
  },
  contactNumber: {
    type: Number,
    required: true,
    trim: true,
    minlength: [10, "Contact number must be at least 10 digits"],
    maxlength: [10, "Contact number must be at most 10 digits"],
    match: [/^\d{10}$/, "Contact number must be a valid 10-digit number"], // Regex for validation
  },
  feesPaid: {
    type: Number,
    required: true,
    trim: true,
    min: 10000,
    max: 100000,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    maxlength: 1000,
  },
  assignedClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = {
  Student,
};
