import { db } from "/js/firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ========================= */
/* GET LINK ID */
/* ========================= */
const params = new URLSearchParams(location.search);
const linkId = params.get("id");

if (!linkId) {
  alert("Link tidak valid");
  location.href = "/";
}

/* ========================= */
/* ELEMENTS */
/* ========================= */
const stepLoading = document.getElementById("stepLoading");
const stepInfo = document.getElementById("stepInfo");
const stepTask = document.getElementById("stepTask");
const stepDone = document.getElementById("stepDone");

const linkTitle = document.getElementById("linkTitle");
const startBtn = document.getElementById("startBtn");
const downloadBtn = document.getElementById("downloadBtn");
const progressBar = document.getElementById("progressBar");

/* ========================= */
/* STATE */
/* ========================= */
let targetUrl = "";
let currentTask = 0;

/* ========================= */
/* FETCH DATA */
/* ========================= */
const ref = doc(db, "links", linkId);
const snap = await getDoc(ref);

if (!snap.exists()) {
  alert("Link sudah dihapus");
  location.href = "/";
}

const data = snap.data();

/* ========================= */
/* EXPIRE CHECK */
/* ========================= */
if (data.expiresAt.toDate() < new Date()) {
  alert("Link sudah kedaluwarsa");
  location.href = "/";
}

/* ========================= */
/* SHOW INFO */
/* ========================= */
linkTitle.innerText = data.title;
targetUrl = data.targetUrl;

stepLoading.classList.add("hidden");
stepInfo.classList.remove("hidden");

/* ========================= */
/* START FLOW */
/* ========================= */
startBtn.onclick = async () => {
  stepInfo.classList.add("hidden");
  stepTask.classList.remove("hidden");

  await updateDoc(ref, {
    views: increment(1)
  });

  startTask();
};

/* ========================= */
/* TASK SYSTEM */
/* ========================= */
function startTask() {
  const tasks = document.querySelectorAll(".task");
  tasks[currentTask].classList.remove("locked");

  let seconds = 6;

  const timer = setInterval(() => {
    seconds--;
    progressBar.style.width = `${(1 - seconds / 6) * 100}%`;

    if (seconds <= 0) {
      clearInterval(timer);
      tasks[currentTask].innerText = "✔ Selesai";
      tasks[currentTask].classList.add("done");

      currentTask++;
      progressBar.style.width = "0%";

      if (currentTask < tasks.length) {
        startTask();
      } else {
        finish();
      }
    }
  }, 1000);
}

/* ========================= */
/* FINISH */
/* ========================= */
function finish() {
  stepTask.classList.add("hidden");
  stepDone.classList.remove("hidden");

  downloadBtn.onclick = () => {
    location.href = targetUrl;
  };
}

