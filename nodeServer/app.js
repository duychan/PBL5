const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const connectDB = require("./db/connect");
connectDB();
const { port } = require("./config");
const mobileApp = io.of("/mobileApp");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const userRouter = require("./routers/register");
const loginRouter = require("./routers/login");
const heartRouter = require("./routers/heartRate");
app.use(express.static(__dirname + "../node_modules/socket.io/client-dist"));
app.use(express.static(__dirname));
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname + "/index.html"));
// });
app.use(express.json());

const oneDay = 1000 * 60 * 60 * 24;
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "yeu hg",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);
app.use("/register", userRouter);
app.use("/login", loginRouter);
app.use("/heart", heartRouter);
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("test", (res) => {
    console.log(res);
  });
});

mobileApp.on("*", (res) => {});

server.listen(port, () => {
  console.log(`Server runing on port ${port}`);
});
