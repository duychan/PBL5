const express = require("express")
const router = express.Router()
const { Heart } = require("../models/heart")
const { User } = require("../models/user");
const ECGs = require("../app");

router
  .route("/")
  .post(async (req, res, next) => {
    try {
      if (req.session.user) {
        const userId = req.session.user;
        const date = new Date().getTime();
        const level = 3; // handle data from ML by pass here
        const newHeart = new Heart({ date, ECGs, level });
        const userFounded = await User.findOne({ userId });
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
    try {
      console.log(ECGs.data);
      const userId = req.session.user;
      if (userId) {
        const user = await User.findById(userId);
        arrHeart = user.hearts;
        const x = arrHeart.map(async (e) => {
          return await Heart.findOne({ e });
        });
        Promise.all(x).then((val) => {
          res.status(201).json(val);
        });
      } else {
        res.status(201).json({
          mess: "co cai cc",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(201).json({
        mess: "co cai cc",
      });
    }
  });
  
module.exports = router
