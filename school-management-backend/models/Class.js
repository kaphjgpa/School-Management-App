const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 255,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  teacherName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 255,
  },
  studentFees: {
    type: Number,
    required: true,
    trim: true,
    min: 10000,
    max: 100000,
  },
  maxStudents: {
    type: Number,
    required: true,
    min: 1,
    max: 40,
  },
  year: {
    type: Number,
    required: true,
    min: 2024,
    max: 2030,
  },
  studentList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

const Class = mongoose.model("Class", classSchema);

module.exports = {
  Class,
};
