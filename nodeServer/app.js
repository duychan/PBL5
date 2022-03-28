const connectDB = require("./db/connect");
connectDB();
const { port } = require("./config");
const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mobileApp = io.of("/mobileApp");

app.use(express.static(__dirname + "../node_modules/socket.io/client-dist"));
app.use(express.static(__dirname));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
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