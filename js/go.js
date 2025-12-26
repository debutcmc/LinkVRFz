/* =====================================================
   LINKVRFz - GO.JS (TOKEN LOCKER FINAL)
   ===================================================== */

/* ============================= */
/* GLOBAL STATE */
/* ============================= */
let linkData = null;
let targetUrl = "#";

let totalTask = 3;
let currentTask = 0;
let tasksDone = [];
let taskTimer = null;

/* ============================= */
/* GET TOKEN */
/* ============================= */
const params = new URLSearchParams(window.location.search);
const token = params.get("v");

if (!token) {
  fatalError("Token tidak ditemukan");
}

/* ============================= */
/* RESOLVE TOKEN (LOCAL MODE) */
/* ============================= */
try {
  const raw = localStorage.getItem("linkvrfz:" + token);
  if (!raw) fatalError("Link tidak valid atau sudah dihapus");

  linkData = JSON.parse(raw);

  if (!linkData.targetUrl || !linkData.expiredAt) {
    fatalError("Data link rusak");
  }

  if (Date.now() > linkData.expiredAt) {
    fatalError("Link sudah expired");
  }

  targetUrl = linkData.targetUrl;
} catch (e) {
  fatalError("Gagal memuat link");
}

/* ============================= */
/* INIT */
/* ============================= */
tasksDone = new Array(totalTask).fill(false);

setTimeout(() => {
  hide("stepVerify");
  showFileCard();
}, 2000);

/* ============================= */
/* FILE CARD */
/* ============================= */
function showFileCard() {
  const fileNameEl = document.getElementById("fileName");
  if (fileNameEl) {
    fileNameEl.innerText = linkData.title || "Download File";
  }

  show("stepFile");

  setTimeout(() => {
    hide("stepFile");
    show("stepTask");
    initTasks();
  }, 1600);
}

/* ============================= */
/* TASK SYSTEM */
/* ============================= */
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
  if (index !== currentTask) return;
  if (tasksDone[index]) return;

  const task = document.querySelectorAll(".task")[index];
  if (!task) return;

  /* 🔥 OPEN SMARTLINK */
  window.open(
    "https://www.effectivegatecpm.com/h06jd728?key=243d13fa860cbf346b1d7cc99aa435f9",
    "_blank"
  );

  let seconds = 8 + index * 4;
  task.innerText = `⏳ Verifikasi (${seconds}s)`;
  task.style.pointerEvents = "none";

  taskTimer = setInterval(() => {
    seconds--;
    task.innerText = `⏳ Verifikasi (${seconds}s)`;

    if (seconds <= 0) {
      clearInterval(taskTimer);
      completeTask(index);
    }
  }, 1000);
}

function completeTask(index) {
  tasksDone[index] = true;

  const tasks = document.querySelectorAll(".task");
  const task = tasks[index];

  task.classList.add("done");
  task.innerText = "✔ Task selesai";

  currentTask++;
  if (tasks[currentTask]) {
    unlockTask(tasks[currentTask], currentTask);
  }

  updateProgress();
}

function updateProgress() {
  const done = tasksDone.filter(Boolean).length;
  const percent = Math.round((done / totalTask) * 100);

  const bar = document.getElementById("progressBar");
  if (bar) bar.style.width = percent + "%";

  if (done === totalTask) {
    const btn = document.getElementById("taskBtn");
    if (!btn) return;

    btn.disabled = false;
    btn.innerText = "LANJUTKAN";
    btn.onclick = () => {
      hide("stepTask");
      show("stepArticle");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }
}

/* ============================= */
/* SCROLL → DOWNLOAD */
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
