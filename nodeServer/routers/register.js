const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
router.route("/register").post(async (req, res) => {
  try {
    const { email, passWord, name, gender, phoneNumber } = req.body;
    const user = new User({ email, passWord, name, gender, phoneNumber });
    await user.save();
    res.status.json(user);
  } catch (err) {
    const errors = err.errors;
    const keys = Object.keys(errors);
    const errObj = {};
    keys.forEach((key) => {
      errObj[key] = errors[key].message;
    });
    res.status(400).json({
      success: false,
      err: errObj,
    });
  }
});
module.exports = router;
