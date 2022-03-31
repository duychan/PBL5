const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    require: true,
  },
  passWord: {
    type: String,
    require: true,
  },
  name: {
    required: true,
    type: String,
  },
  gender: {
    required: true,
    type: Boolean,
  },
  phoneNumber: {
    type: String,
    require: true,
    unique: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = {
  User,
};
