const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 3,
    },
    teacherName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 255,
    },
    studentsFees: {
      type: Number,
      required: true,
      trim: true,
      min: 1000,
      max: 12000,
    },
    maxStudents: {
      type: Number,
      required: true,
      default: 30,
    },
    currentStudents: {
      type: Number,
      default: 0,
      validate: {
        validator: function (v) {
          return v <= this.maxStudents;
        },
        message:
          "Current students count should not exceed the maximum allowed.",
      },
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
        index: true,
        validate: {
          validator: function (v) {
            return v.length <= this.maxStudents;
          },
          message: "Student list exceeds the maximum allowed.",
        },
      },
    ],
  },
  { timestamps: true }
);

// Virtual property to calculate available slots
classSchema.virtual("availableSlots").get(function () {
  return this.maxStudents - this.currentStudents;
});

const Class = mongoose.model("Class", classSchema);

module.exports = {
  Class,
};
