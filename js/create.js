function generateLink() {
  const to = document.getElementById("to").value.trim();
  const name = document.getElementById("name").value.trim() || "Untitled";
  const mode = document.getElementById("mode").value;

  if (!isValidUrl(to)) {
    showMainResult("❌ Format link tidak valid");
    return;
  }

  const base = window.location.origin;
  const finalLink = `${base}/download/go?to=${encodeURIComponent(to)}&mode=${mode}`;

  const fileType = detectFileType(to);

  showMainResult(`
    <strong>Link berhasil dibuat</strong><br><br>
    <input value="${finalLink}" onclick="this.select()" style="width:100%;padding:10px">
    <small>Klik untuk copy</small>
  `);

  addHistoryCard(name, fileType, mode, finalLink);
}

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

function showMainResult(html) {
  document.getElementById("mainResult").innerHTML = html;
}

function addHistoryCard(name, type, mode, link) {
  const card = document.createElement("div");
  card.className = "history-card";
  card.innerHTML = `
    <div><span>${name}</span></div>
    <div>Type: ${type}</div>
    <div>Mode: ${mode}</div>
    <div>Link:</div>
    <div style="word-break:break-all">${link}</div>
    <div class="copy-btn" onclick="copyText('${link}')">[ Copy ]</div>
  `;
  document.getElementById("historyList").prepend(card);
}

function copyText(text) {
  navigator.clipboard.writeText(text);
  alert("Link disalin!");
}
