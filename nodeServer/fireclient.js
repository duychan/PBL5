const { initializeApp } = require("firebase/app");
const {
  getDatabase,
  ref,
  set,
  onValue,
  remove,
  update,
} = require("firebase/database");
const firebaseConfig = {
  apiKey: "AIzaSyDpoA6dL5HXI82I9-Sf3jDcMeOIcET8_pQ",

  authDomain: "espfirebase-b9634.firebaseapp.com",

  databaseURL: "https://espfirebase-b9634-default-rtdb.firebaseio.com",

  projectId: "espfirebase-b9634",

  storageBucket: "espfirebase-b9634.appspot.com",

  messagingSenderId: "734966023585",

  appId: "1:734966023585:web:e6a4bdfb2342f03e2a77e0",

  measurementId: "G-62H1KT62HB",
};
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
let i = 0;
function myLoop() {
  setTimeout(function () {
    update(ref(db, "ECG/"), {
      data: "1,2,3,4,5,6,7,8,9,10" + i,
    });
    ++i;
    myLoop();
  }, 2000);
}
myLoop();
module.exports = { myLoop };
