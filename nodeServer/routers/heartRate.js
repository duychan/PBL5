const express = require("express");
const session = require("express-session");
const router = express.Router();
const Heart = require("../models/heart");
const User = require("../models/user");
const client = require("../clientSK");
const dt = new Date();
const arrHeart = [];
const fakeHeart = [
  {
    id: "id1",
    date: dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate(),
    BPM: 80,
    level: 2,
    owner: "id1a",
  },
  {
    id: "id2",
    date: dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate() + 1,
    BPM: 60,
    level: 1,
    owner: "id1a",
  },
  {
    id: "id3",
    date: dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate() + 2,
    BPM: 85,
    level: 3,
    owner: "id1a",
  },
  {
    id: "id4",
    date: dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate() + 3,
    BPM: 100,
    level: 3,
    owner: "id1a",
  },
];
router
  .route("/")
  .get(async (req, res) => {
    try {
      console.log(req.session.user);
    } catch (error) {
      console.log(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const userId = req.session;
      console.log(userId);
      const { date, BPM, level } = req.body;
      const userFounded = await User.findById({ _id: userId });
      const newHeart = new Heart({ date, BPM, level });
      newHeart.owner = userFounded;
      await newHeart.save();
      arrHeart.push(newHeart);
      await userFounded.save();
      res.status(201).json(userFounded);
    } catch (error) {}
  });

module.exports = router;