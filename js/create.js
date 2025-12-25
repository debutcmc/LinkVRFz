function generateLink() {
  const to = document.getElementById("to").value.trim();
  const name = document.getElementById("name").value.trim() || "Untitled";
  const mode = document.getElementById("mode").value;

  if (!isValidUrl(to)) {
    showMainResult("❌ Format link tidak valid");
    return;
  }

  const base = window.location.origin;
  const finalLink =
    `${base}/download/go?to=${encodeURIComponent(to)}&mode=${mode}`;

  const fileType = detectFileType(to);

  showMainResult(`
    <strong>Link berhasil dibuat</strong><br><br>
    <input value="${finalLink}" onclick="this.select()" style="width:100%;padding:10px">
    <small>Klik untuk copy</small>
  `);

  addHistoryCard(name, fileType, mode, finalLink);
}

/* ============================= */
/* UTIL */
/* ============================= */

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function detectFileType(url) {
  const lower = url.toLowerCase();
  if (lower.includes(".apk")) return "APK";
  if (lower.includes(".zip")) return "ZIP";
  if (lower.includes(".mcaddon")) return "MC ADDON";
  if (lower.includes("drive.google")) return "DRIVE FILE";
  return "FILE";
}

/* ============================= */
/* UI HANDLER */
/* ============================= */

function showMainResult(html) {
  document.getElementById("mainResult").innerHTML = html;
}

function addHistoryCard(name, type, mode, link) {
  const card = document.createElement("div");
  card.className = "link-card";

  card.innerHTML = `
    <div class="row"><strong>Nama:</strong> ${name}</div>
    <div class="row"><strong>Type:</strong> ${type}</div>
    <div class="row"><strong>Mode:</strong> ${mode}</div>
    <div class="row"><strong>Link:</strong></div>
    <div class="row" style="word-break:break-all">${link}</div>
    <button class="copy-btn" onclick="copyText('${link}')">COPY</button>
  `;

  document.getElementById("historyList").prepend(card);
}

function copyText(text) {
  navigator.clipboard.writeText(text);
}
