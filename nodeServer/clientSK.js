const socket = io("/sensor");
const btnOk = document.querySelector(".btn");
let x;
let isOpen = false;
btnOk.addEventListener("click", function () {
  if (!isOpen) {
    console.log("click send");
    x = setInterval(() => {
      socket.emit("receive", Math.floor(Math.random() * 500));
    }, 100);
    isOpen = true;
  } else {
    console.log("click stop");
    clearInterval(x);
    isOpen = false;
    socket.emit("stop");
  }
});
// const x = setInterval(function () {
//     ECG.push(Math.floor(Math.random() * 500));
//     if (ECG.length === 19) {
//       console.log(`array ECG ${ECG}`);
//       ECGs.push(ECG);
//       clearInterval(x);
//     }
//   }, 200);
