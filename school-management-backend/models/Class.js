const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  classname: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 255,
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  teacher: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 255,
  },
  studentfees: {
    type: Number,
    required: true,
    trim: true,
    min: 100,
    max: 1000,
  },
  assignedClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

const Class = mongoose.model("Class", classSchema);

module.exports = {
  Class,
};
