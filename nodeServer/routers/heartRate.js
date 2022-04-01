const express = require("express");
const router = express.Router();
const Heart = require("../models/heart");
const User = require("../models/user");
router.route("/heartRate").get(async (req, res) => {
  try {
    const user = await User.findOne();
  } catch (error) {}
});
const history = [];
const obj = {}; // object from socket
if (history.length > 30) {
  history.pop(0);
  history.push(obj);
} else {
  history.push(obj);
}
