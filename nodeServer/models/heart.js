const mongoose = require("mongoose");
const { Schema } = mongoose;
const heartSchema = new Schema({
  date: {
    type: Date,
    require: true,
  },
  BPM: {
    type: Number,
    require: true,
  },
  level: {
    type: Number,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
const Heart = mongoose.model("Heart", heartSchema);
module.exports = {
  Heart,
};
