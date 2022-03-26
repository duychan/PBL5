const db = require("mongoose")
const url = "mongodb+srv://pbl5:pbl5@cluster0.qp1tm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const connectDB = async () => {
    try {
        await db.connect(url)
        console.log("Connected to db...")
    } catch (error) {
        console.log(`Can't connect to db ${error.message}`)
    }
}
module.exports = connectDB