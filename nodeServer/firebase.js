const e = require("express");
const fs = require("fs");
const { myLoop, updateState } = require("./fireclient");
const admin = require("firebase-admin");
const { getDatabase } = require("firebase-admin/database");
const serviceAccount = require("../config/espfirebase-b9634-firebase-adminsdk-9xr47-a9073cf985.json");
const { time } = require("console");
const { resolve } = require("path");
const { spawnSync } = require("child_process");
const { spawn } = require("child_process");
const { async } = require("@firebase/util");

// Initialize Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // The database URL depends on the location of the database
  databaseURL: "https://espfirebase-b9634-default-rtdb.firebaseio.com",
});

const dbRealtime = getDatabase();

const db_store = admin.firestore();

const getBPM = () => {
  let val = 1;
  const refBPM = dbRealtime.ref("BPM");
  refBPM.on("child_changed", (snapshot) => {
    const val = snapshot.val();
  });
  return val;
};
const saveUser = async (userId, x) => {
  const user = await db_store.collection("users").doc(userId).get();
  const histories = user.data().histories;
  if (!user.exists) {
    console.log("No document");
  } else {
    //console.log(user.data());
  }
  const benh = x.trim();
  console.log("benh" + benh); //processModel()
  const nextTime = {
    bpm: null,
    time: new Date(),
    outcome: null,
  };
  if (benh) {
    nextTime.outcome = true;
  } else {
    nextTime.outcome = false;
  }
  histories.push(nextTime);
  await db_store.collection("users").doc(userId).update({
    histories: histories,
  });
};

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function sleep(fn, ...args) {
  await timeout(10000);
  return fn(...args);
}

let userId = "";
const getIdUser = (() => {
  const refUser = dbRealtime.ref("state");
  refUser.orderByChild("do").on("child_changed", async (snapshot) => {
    const value = snapshot.val();
    if (value == 1) {
      // get userId
      refUser.orderByChild("userfake").once("value", (data) => {
        userId = data.val().userfake;
        console.log(userId);
      });
      console.log("start", userId);
      // call function get data sensor
      getECG(userId);
    } else {
      console.log("off ecg");
      offECG();
    }
  });
})();

// HAVE DONE
const { once } = require("events");
const processModel = async (url, val) => {
  let receive = "";
  const { spawn } = require("child_process");
  const process = spawn("python", [url, val]);
  process.stdin.setEncoding = "utf-8";
  process.stdout.on("data", (data) => {
    receive += data.toString();
    console.error("on", receive);
  });
  process.stderr.on("data", (data) => {
    //console.error("err", data.toString("utf8"));
  });
  process.stdout.on("end", async (code) => {
    console.log("output: " + receive);
    console.log(`Exit code is: ${code}`);
  });
  await once(process, "close");
  return receive;
};

const processModel1 = (url, val) => {
  const process = spawn("python", [url, val]);
  process.stdout.on("data", (data) => {
    console.error("on", data.toString());
    return data;
  });
  process.stderr.on("data", (data) => {
    console.error("err", data.toString("utf8"));
  });
};
var URL_PATH = "E:/PBL5/algorithm/conc.py"; // windows

// send data from sensor to model
let newArr = [];
const getECG = (urserId) => {
  const refECG = dbRealtime.ref("conc");
  let arr = [];
  refECG.on("child_changed", async (snapshot) => {
    const value = snapshot.val();
    const ar = value.split(",");
    newArr = ar.reduce((acc, cur) => {
      acc.push(cur);
      return acc;
    }, arr);
    newArr.pop();
    console.log(`process running ${(newArr.length / 3500) * 100}%`);
    if (newArr.length > 50) {
      newArr = newArr.toString();
      const x = await processModel(URL_PATH, newArr);
      await saveUser(urserId, x);
      updateState();
      newArr = [];
      arr = [];
    }
  });
};

const offECG = () => {
  const refECG = dbRealtime.ref("conc");
  refECG.off();
};