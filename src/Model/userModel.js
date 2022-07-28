const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
    
    },
    lastName: {
      type: String,
      
    },
    email_id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 10,
      max: 15,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User5", userSchema);
