let targetUrl;
let tasksDone = [false, false, false];

const params = new URLSearchParams(location.search);
const to = params.get("to");
const mode = params.get("mode") || "medium";

targetUrl = decodeURIComponent(to);

// STEP 1 → VERIFY
setTimeout(() => {
  document.getElementById("stepVerify").style.display = "none";
  showFileCard();
}, 2000);

// STEP 2
function showFileCard() {
  document.getElementById("fileName").innerText = "Download File";
  document.getElementById("stepFile").style.display = "block";

  setTimeout(() => {
    document.getElementById("stepFile").style.display = "none";
    document.getElementById("stepTask").style.display = "block";
  }, 2000);
}

// STEP 3
function completeTask(i) {
  if (tasksDone[i]) return;

  tasksDone[i] = true;
  document.querySelectorAll(".task")[i].classList.add("done");

  updateProgress();
}

function updateProgress() {
  const done = tasksDone.filter(Boolean).length;
  const percent = (done / 3) * 100;

  document.getElementById("progressBar").style.width = percent + "%";

  if (done === 3) {
    const btn = document.getElementById("taskBtn");
    btn.disabled = false;
    btn.innerText = "GO";
    btn.onclick = () => {
      document.getElementById("stepTask").style.display = "none";
      document.getElementById("stepArticle").style.display = "block";
    };
  }
}

// STEP 4 → SCROLL DETECT
window.addEventListener("scroll", () => {
  const btn = document.getElementById("downloadBtn");
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
  ) {
    btn.style.display = "block";
  }
});

function continueDownload() {
  window.location.href = targetUrl;
}
