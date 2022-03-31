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

const userRouter = require("./routers/register");
const loginRouter = require("./routers/login");
app.use(express.static(__dirname + "../node_modules/socket.io/client-dist"));
//app.use(express.static(__dirname));
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname + "/index.html"));
// });
app.use(express.json());

app.use("/register", userRouter);
app.use("/login", loginRouter);

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
