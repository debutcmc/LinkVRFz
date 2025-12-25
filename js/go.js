/* =====================================================
   LINKVRFz - GO.JS (PRO LOCKER UPGRADE)
   ===================================================== */

/* ============================= */
/* GLOBAL STATE */
/* ============================= */
let targetUrl = "#";
let totalTask = 3;
let currentTask = 0;
let tasksDone = [];
let taskTimer = null;

/* ============================= */
/* GET PARAMS */
/* ============================= */
const params = new URLSearchParams(window.location.search);
const to = params.get("to");
const mode = params.get("mode") || "medium";

if (to) {
  try {
    targetUrl = decodeURIComponent(to);
  } catch {
    targetUrl = to;
  }
}

/* ============================= */
/* MODE CONFIG */
/* ============================= */
switch (mode) {
  case "easy":
    totalTask = 1;
    break;
  case "hard":
    totalTask = 5;
    break;
  default:
    totalTask = 3;
}

tasksDone = new Array(totalTask).fill(false);

/* ============================= */
/* STEP 1 → VERIFY */
/* ============================= */
setTimeout(() => {
  hide("stepVerify");
  showFileCard();
}, 2200);

/* ============================= */
/* STEP 2 → FILE CARD */
/* ============================= */
function showFileCard() {
  const fileNameEl = document.getElementById("fileName");
  if (fileNameEl) {
    fileNameEl.innerText = extractFileName(targetUrl);
  }

  show("stepFile");

  setTimeout(() => {
    hide("stepFile");
    show("stepTask");
    initTasks();
  }, 1800);
}

/* ============================= */
/* INIT TASKS */
/* ============================= */
function initTasks() {
  const tasks = document.querySelectorAll(".task");

  tasks.forEach((task, i) => {
    if (i >= totalTask) {
      task.style.display = "none";
      return;
    }

    if (i === 0) {
      unlockTask(task, i);
    } else {
      lockTask(task);
    }
  });
}

/* ============================= */
/* LOCK / UNLOCK */
/* ============================= */
function lockTask(task) {
  task.classList.add("locked");
  task.style.pointerEvents = "none";
}

function unlockTask(task, index) {
  task.classList.remove("locked");
  task.style.pointerEvents = "auto";
  task.onclick = () => startTask(index);
}

/* ============================= */
/* START TASK */
/* ============================= */
function startTask(index) {
  if (index !== currentTask) return;
  if (tasksDone[index]) return;

  const task = document.querySelectorAll(".task")[index];
  if (!task) return;

  // 🔥 BUKA SMARTLINK / IKLAN
  window.open("https://pl28332833.effectivegatecpm.com/3c/11/be/3c11be954c21e2bc097ee0436eadf3a2.js", "_blank");

  let seconds = 8 + index * 4; // makin bawah makin lama
  task.innerText = `⏳ Memverifikasi (${seconds}s)`;
  task.style.pointerEvents = "none";

  taskTimer = setInterval(() => {
    seconds--;
    task.innerText = `⏳ Memverifikasi (${seconds}s)`;

    if (seconds <= 0) {
      clearInterval(taskTimer);
      completeTask(index);
    }
  }, 1000);
}

/* ============================= */
/* COMPLETE TASK */
/* ============================= */
function completeTask(i) {
  tasksDone[i] = true;

  const tasks = document.querySelectorAll(".task");
  const task = tasks[i];

  task.classList.add("done");
  task.innerText = "✔ Task selesai";

  currentTask++;

  if (tasks[currentTask]) {
    unlockTask(tasks[currentTask], currentTask);
  }

  updateProgress();
}

/* ============================= */
/* UPDATE PROGRESS */
/* ============================= */
function updateProgress() {
  const done = tasksDone.filter(Boolean).length;
  const percent = Math.round((done / totalTask) * 100);

  const bar = document.getElementById("progressBar");
  if (bar) bar.style.width = percent + "%";

  if (done === totalTask) {
    const btn = document.getElementById("taskBtn");
    if (btn) {
      btn.disabled = false;
      btn.innerText = "LANJUTKAN VERIFIKASI";
      btn.onclick = () => {
        hide("stepTask");
        show("stepArticle");
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    }
  }
}

/* ============================= */
/* STEP 4 → SCROLL DETECT */
/* ============================= */
window.addEventListener("scroll", () => {
  const article = document.getElementById("stepArticle");
  const btn = document.getElementById("downloadBtn");

  if (!article || article.style.display === "none") return;

  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 50
  ) {
    btn.style.display = "block";
  }
});

/* ============================= */
/* FINAL DOWNLOAD */
/* ============================= */
function continueDownload() {
  if (!targetUrl || targetUrl === "#") {
    alert("Link download tidak valid");
    return;
  }

  window.location.href = targetUrl;
}

/* ============================= */
/* HELPERS */
/* ============================= */
function show(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
}

function hide(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

function extractFileName(url) {
  try {
    const u = new URL(url);

    if (u.hostname.includes("drive.google.com")) {
      return "Google Drive File";
    }

    let name = u.pathname.split("/").pop();
    return name ? decodeURIComponent(name) : "Download File";
  } catch {
    return "Download File";
  }
}
