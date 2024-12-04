const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  teachername: {
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
    type: Number,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
  },
  contactNumber: {
    type: Number,
    required: true,
    trim: true,
    min: 100,
    max: 1000,
  },
  salary: {
    type: Number,
    required: true,
    trim: true,
    min: 10000,
    max: 100000,
  },
  assignedClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = {
  Teacher,
};
