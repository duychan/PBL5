const socket = io();
socket.emit("test", {
  mess: "test message",
});
