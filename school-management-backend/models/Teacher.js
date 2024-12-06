const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  teacherFirstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
  },
  teacherLastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 1000,
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
    type: String,
    required: true,
    trim: true,
    minlength: [10, "Contact number must be at least 10 digits"],
    maxlength: [10, "Contact number must be at most 10 digits"],
    match: [/^\d{10}$/, "Contact number must be a valid 10-digit number"], // Regex for validation
  },
  salary: {
    type: Number,
    required: true,
    trim: true,
    min: 10000,
    max: 100000,
  },
  assignedClass: {
    type: String,
    required: false,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = {
  Teacher,
};
