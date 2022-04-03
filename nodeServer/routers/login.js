const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
router.route("/").post(async (req, res) => {
  try {
    const { email, passWord } = req.body;
    if (!email || !passWord) {
      res.status(400).json({
        status: false,
        mess: "invalid username or password",
      });
      return false;
    }
    const user = await User.findOne({ email, passWord });
    if (!user) {
      res.status(400).json({
        status: false,
        mess: "username or password is in correct",
      });
      return false;
    } else {
      req.session.user = user;
      console.log(`session ok id object ${req.session.user}`);
      res.status(200).json({
        status: "login successfully",
        success: true,
        newUser: user,
      });
    }
  } catch (err) {}
});
module.exports = router;
