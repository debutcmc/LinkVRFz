/* =====================================================
   LINKVRFz - GO.JS (FIRESTORE TOKEN LOCKER)
   ===================================================== */

import { db } from "/js/firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =============================
   GLOBAL STATE
   ============================= */

let linkData = null;
let targetUrl = "#";

let totalTask = 3;
let currentTask = 0;
let tasksDone = [];

/* =============================
   GET LINK ID
   ============================= */

const params = new URLSearchParams(window.location.search);
const linkId = params.get("id");

if (!linkId) {
  fatalError("ID link tidak ditemukan");
}

/* =============================
   LOAD LINK FROM FIRESTORE
   ============================= */

(async function init() {
  try {
    const linkRef = doc(db, "links", linkId);
    const snap = await getDoc(linkRef);

    if (!snap.exists()) {
      fatalError("Link tidak valid atau telah dihapus");
    }

    linkData = snap.data();

    if (Date.now() > linkData.expiredAt) {
      fatalError("Link sudah expired");
    }

    targetUrl = linkData.targetUrl;

    /* 🔥 KUNCI TOKEN SEKALI SAJA */
    if (!linkData.tokenUsed) {
      await updateDoc(linkRef, {
        tokenUsed: true
      });

      const userRef = doc(db, "users", linkData.ownerId);
      await updateDoc(userRef, {
        token: increment(-1)
      });
    }

    startUI();
  } catch (err) {
    console.error(err);
    fatalError("Gagal memuat link");
  }
})();

/* =============================
   UI FLOW
   ============================= */

function startUI() {
  tasksDone = new Array(totalTask).fill(false);

  setTimeout(() => {
    hide("stepVerify");
    showFileCard();
  }, 1800);
}

/* =============================
   FILE CARD
   ============================= */

function showFileCard() {
  document.getElementById("fileName").innerText =
    linkData.title || "Download File";

  show("stepFile");

  setTimeout(() => {
    hide("stepFile");
    show("stepTask");
    initTasks();
  }, 1500);
}

/* =============================
   TASK SYSTEM
   ============================= */

function initTasks() {
  const tasks = document.querySelectorAll(".task");

  tasks.forEach((task, i) => {
    if (i === 0) unlockTask(task, i);
    else lockTask(task);
  });
}

function lockTask(task) {
  task.classList.add("locked");
  task.style.pointerEvents = "none";
}

function unlockTask(task, index) {
  task.classList.remove("locked");
  task.style.pointerEvents = "auto";
  task.onclick = () => startTask(index);
}

function startTask(index) {
  if (index !== currentTask || tasksDone[index]) return;

  const task = document.querySelectorAll(".task")[index];

  window.open(
    "https://www.effectivegatecpm.com/h06jd728?key=243d13fa860cbf346b1d7cc99aa435f9",
    "_blank"
  );

  let seconds = 8 + index * 4;
  task.innerText = `⏳ Verifikasi (${seconds}s)`;
  task.style.pointerEvents = "none";

  const timer = setInterval(() => {
    seconds--;
    task.innerText = `⏳ Verifikasi (${seconds}s)`;

    if (seconds <= 0) {
      clearInterval(timer);
      completeTask(index);
    }
  }, 1000);
}

function completeTask(index) {
  tasksDone[index] = true;

  const task = document.querySelectorAll(".task")[index];
  task.classList.add("done");
  task.innerText = "✔ Task selesai";

  currentTask++;
  if (document.querySelectorAll(".task")[currentTask]) {
    unlockTask(
      document.querySelectorAll(".task")[currentTask],
      currentTask
    );
  }

  updateProgress();
}

function updateProgress() {
  const done = tasksDone.filter(Boolean).length;
  document.getElementById("progressBar").style.width =
    Math.round((done / totalTask) * 100) + "%";

  if (done === totalTask) {
    const btn = document.getElementById("taskBtn");
    btn.disabled = false;
    btn.innerText = "LANJUTKAN";
    btn.onclick = () => {
      hide("stepTask");
      show("stepArticle");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }
}

/* =============================
   SCROLL → DOWNLOAD
   ============================= */

window.addEventListener("scroll", () => {
  const article = document.getElementById("stepArticle");
  const btn = document.getElementById("downloadBtn");

  if (!article || article.style.display === "none") return;

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
    btn.style.display = "block";
  }
});

window.continueDownload = function () {
  if (!targetUrl) {
    alert("Link tidak valid");
    return;
  }
  window.location.href = targetUrl;
};

/* =============================
   HELPERS
   ============================= */

function show(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
}

function hide(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

function fatalError(msg) {
  document.body.innerHTML = `
    <div style="
      padding:40px;
      font-family:Arial;
      background:#0f0f0f;
      color:#fff;
      text-align:center
    ">
      <h2>${msg}</h2>
    </div>
  `;
  throw new Error(msg);
}
