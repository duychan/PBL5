const e = require("express");
const fs = require("fs");
const csv = require("csv-parse");
const { myLoop } = require("./fireclient");
const admin = require("firebase-admin");
const { getDatabase } = require("firebase-admin/database");
const serviceAccount = require("../config/espfirebase-b9634-firebase-adminsdk-9xr47-a9073cf985.json");
const { time } = require("console");
const spawn = require("child_process").spawn;
// Initialize Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // The database URL depends on the location of the database
  databaseURL: "https://espfirebase-b9634-default-rtdb.firebaseio.com",
});

const db_realtime = getDatabase();
const ref = db_realtime.ref("data");
let ECGs = [];
myLoop(); // fake data sensor
let oldTime = 0;
const writeStream = fs.createWriteStream("data.csv");
ref.on("child_changed", (snapshot) => {
  const newData = snapshot.val();
  let start = new Date().getTime();
  if (start - oldTime >= 2000) {
    ECGs = [];
  }
  oldTime = start;
  console.log("value: " + newData);
  if (ECGs.length <= 5) {
    ECGs.push(newData);
  } else {
    try {
      writeStream.write(ECGs.join(",") + "\n");
      // file written successfully
    } catch (err) {
      console.error(err);
    }
    ECGs = [];
  }
});
const db_store = admin.firestore();
const date = new Date();
const newUser = {
  id: "123123",
  name: "duyreal",
  histories: [
    {
      bpm: 123,
      time: date.getDate(),
      outcome: false,
    },
  ],
};
const nextTime = {
  bpm: 111,
  time: date.getDate(),
  outcome: true,
};
newUser.histories.push(nextTime);
const response = db_store
  .collection("users")
  .doc(newUser.id)
  .set(newUser)
  .then((resolve) => {
    console.log(resolve);
  })
  .catch((reject) => {
    console.log(reject);
  });

// const process = spawn("python3", [
//   "/home/duy/Desktop/code/pbl5/pythonCase/test1.py",
//   ECG,
// ]);
// process.stdout.on("data", function (data) {
//   console.log(`result from python ${data} & ${typeof data}`);
// });
