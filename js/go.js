let targetUrl = null;

const params = new URLSearchParams(window.location.search);
const to = params.get("to");
const mode = params.get("mode") || "medium";

const statusBox = document.getElementById("statusBox");
const btn = document.getElementById("continueBtn");

if (!to) {
  statusBox.innerHTML = "❌ Link tidak valid";
} else {
  targetUrl = decodeURIComponent(to);
  startVerification(mode);
}

function startVerification(mode) {
  let waitTime = 3000; // default medium

  if (mode === "easy") waitTime = 1500;
  if (mode === "hard") waitTime = 6000;

  statusBox.innerHTML = `
    🔒 Verifikasi mode <strong>${mode.toUpperCase()}</strong><br>
    Mohon tunggu...
  `;

  setTimeout(() => {
    statusBox.innerHTML = "✅ Verifikasi selesai";
    btn.style.display = "block";
  }, waitTime);
}

function continueDownload() {
  window.location.href = targetUrl;
}

