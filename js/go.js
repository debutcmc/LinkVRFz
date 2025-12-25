/* =====================================================
   LINKVRFz - GO.JS (FINAL)
   ===================================================== */

/* ============================= */
/* GLOBAL STATE */
/* ============================= */
let targetUrl = "#";
let totalTask = 3;
let tasksDone = [];

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
    totalTask = 3; // medium
}

tasksDone = new Array(totalTask).fill(false);

/* ============================= */
/* STEP 1 → VERIFY */
/* ============================= */
setTimeout(() => {
  hide("stepVerify");
  showFileCard();
}, 2000);

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
    renderTasks();
  }, 2000);
}

/* ============================= */
/* RENDER TASK BASED ON MODE */
/* ============================= */
function renderTasks() {
  const container = document.getElementById("stepTask");
  if (!container) return;

  const taskEls = container.querySelectorAll(".task");

  taskEls.forEach((el, i) => {
    if (i >= totalTask) {
      el.style.display = "none";
    } else {
      el.style.display = "block";
    }
  });
}

/* ============================= */
/* STEP 3 → TASK */
/* ============================= */
function completeTask(i) {
  if (tasksDone[i]) return;

  tasksDone[i] = true;

  const taskEls = document.querySelectorAll(".task");
  if (taskEls[i]) {
    taskEls[i].classList.add("done");
    taskEls[i].innerText = "✔ Selesai";
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
    if (btn) {
      btn.disabled = false;
      btn.innerText = "GO";
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
  if (!btn) return;

  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 30
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

    // Google Drive
    if (u.hostname.includes("drive.google.com")) {
      return "Google Drive File";
    }

    let name = u.pathname.split("/").pop();
    if (!name) return "Download File";

    return decodeURIComponent(name);
  } catch {
    return "Download File";
  }
}
