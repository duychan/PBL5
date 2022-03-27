const connectDB = require("./db/connect");
connectDB();
const { port } = require("./config");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mobileApp = io.of("/mobileApp");

app.use(express.static(__dirname + "../node_modules/socket.io/client-dist"));
app.use(express.static(__dirname + "./clientSK"));
app.get("/", (req, res) => {
  res.send(__dirname);
});
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("123", (res) => {
    console.log(res);
  });
});

mobileApp.on("*", (res) => {});

server.listen(port, () => {
  console.log(`Server runing on port ${port}`);
});