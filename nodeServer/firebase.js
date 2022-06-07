import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
  remove,
  update,
} from "firebase/database";
//const firebase = require("firebase");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
let i = 0;
function myLoop() {
  setTimeout(function () {
    set(ref(db, "users/" + i), {
      name: "123",
    });
    ++i;
    if (i < 19) {
      myLoop();
    }
  }, 10000);
}
myLoop();
const refUser = ref(db, "users");
onValue(refUser, (snapshot) => {
  const data = snapshot.val();
  console.log(data);
});
