const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

router.route("/").post(async (req, res) => {
  try {
    const { email, passWord, name, gender, phoneNumber } = req.body;
    const user = new User({ email, passWord, name, gender, phoneNumber });
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({
      success: false,
      mess: err.message,
    });
    console.log(err);
  }
});
module.exports = router;
