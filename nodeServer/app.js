const express = require("express")
const app = express()
const path = require("path")
const server = require("http").createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)
const connectDB = require("./db/connect")
connectDB()
const { port } = require("./config")

const mobileApp = io.of("/mobile") // name space
const sensor = io.of("/sensor") // name space

const session = require("express-session")
const cookieParser = require("cookie-parser")
const userRouter = require("./routers/register")
const loginRouter = require("./routers/login")
const heartRouter = require("./routers/heartRate")
const ip = require("ip")
app.use(express.static(__dirname + "../node_modules/socket.io/client-dist"))
app.use(express.static(__dirname))
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname + "/index.html"));
// });
app.use(express.json())

const oneDay = 1000 * 60 * 60 * 24
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  session({
    secret: "duythaisandinh",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
)

// router
app.use("/register", userRouter)
app.use("/login", loginRouter)
app.use("/heart", heartRouter)

// socket
io.on("connection", (socket) => {
  console.log(socket.id)
  socket.on("*", (res) => {
    console.log(res)
  })
})

// mobile
mobileApp.on("connection", (socket) => {
  console.log("mobile connected")
  socket.on("*", (data) => {
    console.log(data)
  })

  socket.on("disconnect", () => {
    console.log("mobile app left")
  })
})

// sensor
arrECG = []
sensor.on("connection", (socket) => {
  console.log("sensor connected")
  socket.on("*", (data) => {
    console.log(data)
  })
  let ECGs = []

  socket.on("receive", (data) => {
    ECGs.push(data)
    if (ECGs.length > 30) {
      arrECG.push(ECGs)
      ECGs = []
    }
    setTimeout(() => {
      if (ECGs.length < 30) {
        ECGs = []
        console.warn("not enough beat ecg in 60s")
      }
    }, 60000)
    module.exports = { arrECG }
  })
  socket.on("disconnect", () => {
    console.log("sensor left")
  })
})

// build
server.listen(port, () => {
  console.log(`Server runing on port ${port} 
  and ip address is ${ip.address()}`)
})
