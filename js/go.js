/* =====================================================
   LINKVRFz - GO.JS (SECURE FLOW)
   ===================================================== */

/* ============================= */
/* GLOBAL STATE */
/* ============================= */
let targetUrl = "#";
let totalTask = 3;
let tasksDone = [];
let currentTask = 0;

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
      task.classList.remove("locked");
      task.onclick = () => startTask(i);
    } else {
      task.classList.add("locked");
      task.onclick = null;
    }
  });
}

/* ============================= */
/* START TASK (WITH TIMER) */
/* ============================= */
function startTask(index) {
  if (index !== currentTask) return;
  if (tasksDone[index]) return;

  const task = document.querySelectorAll(".task")[index];
  if (!task) return;

  let seconds = 6 + index * 3; // makin bawah makin lama
  task.innerText = `⏳ Menunggu ${seconds}s...`;
  task.style.pointerEvents = "none";

  const timer = setInterval(() => {
    seconds--;
    task.innerText = `⏳ Menunggu ${seconds}s...`;

    if (seconds <= 0) {
      clearInterval(timer);
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

  // unlock next task
  if (tasks[currentTask]) {
    tasks[currentTask].classList.remove("locked");
    tasks[currentTask].onclick = () => startTask(currentTask);
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
      btn.innerText = "LANJUTKAN";
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
    document.body.offsetHeight - 40
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
