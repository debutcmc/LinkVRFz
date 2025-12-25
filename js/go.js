let targetUrl = "#";
let tasksDone = [];
let totalTask = 3;

/* ============================= */
/* GET PARAMS */
/* ============================= */
const params = new URLSearchParams(location.search);
const to = params.get("to");
const mode = params.get("mode") || "medium";

if (to) {
  targetUrl = decodeURIComponent(to);
}

/* ============================= */
/* MODE CONFIG */
/* ============================= */
if (mode === "easy") totalTask = 1;
if (mode === "medium") totalTask = 3;
if (mode === "hard") totalTask = 5;

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
  }, 2000);
}

/* ============================= */
/* STEP 3 → TASK */
/* ============================= */
function completeTask(i) {
  if (tasksDone[i]) return;

  tasksDone[i] = true;

  const taskEls = document.querySelectorAll(".task");
  if (taskEls[i]) taskEls[i].classList.add("done");

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

  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 20
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
    const name = u.pathname.split("/").pop();
    return name || "Download File";
  } catch {
    return "Download File";
  }
}
