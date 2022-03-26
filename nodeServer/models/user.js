const mongoose = require("mongoose")
const Schema = mongoose.Schema
const userSchema = new Schema({
    sex: {
        type: boolean,
        require: true
    },
    age: {
        type: String,
        require: true
    },
    height: {
        type: String,
        require: true
    },
    weight: {
        type: String,
        require: true
    }

})