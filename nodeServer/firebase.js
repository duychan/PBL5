import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
  remove,
  update,
} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA94WHkAm0jpZKnA0OM_9uglfsvY5qndGY",
  authDomain: "pbl50-7af6b.firebaseapp.com",
  databaseURL: "https://pbl50-7af6b-default-rtdb.firebaseio.com",
  projectId: "pbl50-7af6b",
  storageBucket: "pbl50-7af6b.appspot.com",
  messagingSenderId: "522600953130",
  appId: "1:522600953130:web:9a0544553f6ce83be7da53",
  measurementId: "G-DKX53GPDFF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
let i = 11;
function myLoop() {
  setTimeout(function () {
    set(ref(db, "users/" + i));
    ++i;
    if (i < 19) {
      myLoop();
    }
  }, 100);
}
myLoop();
const refUser = ref(db, "users");
onValue(refUser, (snapshot) => {
  const data = snapshot.val();
  console.log(data);
});
