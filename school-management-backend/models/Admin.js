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
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = {
  Admin,
};
