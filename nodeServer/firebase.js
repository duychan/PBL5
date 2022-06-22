const e = require("express");
const fs = require("fs");
const { myLoop } = require("./fireclient");
const admin = require("firebase-admin");
const { getDatabase } = require("firebase-admin/database");
const serviceAccount = require("../config/espfirebase-b9634-firebase-adminsdk-9xr47-a9073cf985.json");
const { time } = require("console");
const { resolve } = require("path");
const { spawnSync } = require("child_process");
const { spawn } = require("child_process");
// Initialize Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // The database URL depends on the location of the database
  databaseURL: "https://espfirebase-b9634-default-rtdb.firebaseio.com",
});

const dbRealtime = getDatabase();

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

let userId = "";
const getIdUser = () => {
  const refUserId = dbRealtime.ref("state");
  refUserId.on("child_changed", (snapshot) => {
    const value = snapshot.val();
    if (value.length > 1) {
      userId = value;
    }
  });
};
getIdUser();
myLoop();
const result = () => {
  return new Promise((resolve, reject) => {
    const URL_PATH = "/home/duy/Desktop/code/pbl5/pythonCase/test1.py";
    const process = spawn("python3", [URL_PATH, getECG]);
    let back;
    process.stdout.on("data", function (data) {
      console.log(`result from python ${data} & ${typeof data}`);
      back = data;
      resolve(back);
    });
    reject("wrong");
  });
};
const getECG = () => {
  let ECGs = [];
  const refECG = dbRealtime.ref("ECG");
  const URL_PATH = "test1.py";
  refECG.on("child_changed", (snapshot) => {
    const value = snapshot.val();
    //console.log(ECGs);
    const process = spawn("python3", [URL_PATH, value]);
    process.stdout.on("data", (data) => {
      console.log(data);
    });
    process.stderr.on("data", (data) => {
      console.log("err", data);
    });
  });
};
getECG();
