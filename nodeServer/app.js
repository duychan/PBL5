const express = require("express")
const app = express()
const path = require("path")
const server = require("http").createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)
const connectDB = require("./db/connect")
const { User } = require("./models/user");
connectDB();
const { port } = require("./config");

const mobileApp = io.of("/mobile"); // name space
const sensor = io.of("/sensor"); // name space

const session = require("express-session");
const cookieParser = require("cookie-parser");
const userRouter = require("./routers/register");
const loginRouter = require("./routers/login");
const heartRouter = require("./routers/heartRate");
const ip = require("ip");
const { builtinModules } = require("module");
app.use(express.static(__dirname + "../node_modules/socket.io/client-dist"));
app.use(express.static(__dirname));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
app.use(express.json());

const oneDay = 1000 * 60 * 60 * 24;
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "duythaisandinh",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

// router
app.use("/register", userRouter);
app.use("/login", loginRouter);
app.use("/heart", heartRouter);

// socket
io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("disconnect", () => {
    console.log(`${socket.id} has left`);
  });
});

// mobile
mobileApp.on("connection", (socket) => {
  console.log("mobile connected");

  socket.on("disconnect", () => {
    console.log("mobile app left");
  });
});

// sensor
sensor.on("connection", (socket) => {
  let ECGs = [];
  console.log("sensor connected");
  let ECG = [];
  socket.on("receive", (data) => {
    //console.log(data);
    ECG.push(data);
    if (ECG.length === 20) {
      //console.log(ECG);
      ECGs.push(ECG);
      console.log(ECGs);
      ECG = [];
    }
  });
  socket.on("stop", () => {
    module.exports.array = ECGs;
  });
  socket.on("disconnect", () => {
    console.log(`sensor id ${socket.id} has left`);
  });
});

// build
server.listen(port, () => {
  console.log(
    `Server runing on port ${port} and ip address is ${ip.address()}`
  );
});
