const express = require("express");
const session = require("express-session");
const router = express.Router();
const { Heart } = require("../models/heart");
const { User } = require("../models/user");
const client = require("../clientSK");

//const arrHeart = [];
router
  .route("/")
  .post(async (req, res, next) => {
    try {
      if (req.session.user) {
        const userId = req.session.user;
        //console.log(userId);
        const date = new Date().getTime();
        const { BPM, level } = req.body;
        const newHeart = new Heart({ date, BPM, level });
        const userFounded = await User.findOne({ userId });
        //console.error(userFounded);
        newHeart.owner = userFounded;
        await newHeart.save();
        userFounded.hearts.push(newHeart);
        arrHeart.push(newHeart);
        await userFounded.save();
        res.status(201).json(userFounded);
      } else {
        console.log("no session");
      }
    } catch (error) {
      console.log(error);
    }
  })
  .get(async (req, res, next) => {
    const userId = req.session.user;
    const user = await User.findOne({ userId });
    arrHeart = user.hearts;
    arrHeart.forEach(async (e) => {
      const heart = await Heart.findOne({ e });
      console.log(JSON.parse(heart.date));
    });
  });

module.exports = router;