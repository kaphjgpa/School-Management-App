const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  firstName: {
    type: String,
    required: true,
    min: 1,
    max: 20,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    min: 10,
    max: 1000,
  },
  contactNumber: {
    type: Number,
    required: true,
    trim: true,
    minlength: [10, "Contact number must be at least 10 digits"],
    maxlength: [10, "Contact number must be at most 10 digits"],
    match: [/^\d{10}$/, "Contact number must be a valid 10-digit number"], // Regex for validation
  },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = {
  Admin,
};
