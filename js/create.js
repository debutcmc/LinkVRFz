function generateLink() {
  const toInput = document.getElementById("to");
  const nameInput = document.getElementById("name");
  const modeSelect = document.getElementById("mode");
  const btn = document.querySelector(".big-btn");

  const to = toInput.value.trim();
  const name = nameInput.value.trim() || "Untitled";
  const mode = modeSelect.value;

  if (!isValidUrl(to)) {
    showMainResult("❌ Format link tidak valid");
    return;
  }

  btn.disabled = true;

  const base = window.location.origin;
  const finalLink =
    `${base}/download/go?to=${encodeURIComponent(to)}&mode=${mode}`;

  const fileType = detectFileType(to);

  showMainResult(`
    <strong>✅ Link berhasil dibuat</strong><br><br>
    <input 
      value="${finalLink}" 
      onclick="this.select()" 
      readonly
      style="width:100%;padding:10px;border-radius:8px;border:1px solid #222;background:#0f0f0f;color:#00ffae"
    >
    <small style="color:#aaa">Klik untuk select, lalu copy</small>
  `);

  addHistoryCard(name, fileType, mode, finalLink);

  btn.disabled = false;
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
  if (lower.includes(".mcpack")) return "MC PACK";
  if (lower.includes("drive.google")) return "GOOGLE DRIVE";
  if (lower.includes("mediafire")) return "MEDIAFIRE";
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
    <div class="row"><strong>Nama:</strong> ${escapeHtml(name)}</div>
    <div class="row"><strong>Type:</strong> ${type}</div>
    <div class="row"><strong>Mode:</strong> ${mode}</div>
    <div class="link">${link}</div>
    <div class="actions">
      <button onclick="copyText('${link}')">COPY</button>
    </div>
  `;

  document.getElementById("historyList").prepend(card);
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("📋 Link copied!");
  });
}

/* ============================= */
/* SAFETY + UX */
/* ============================= */

function escapeHtml(text) {
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}

function showToast(msg) {
  const toast = document.createElement("div");
  toast.innerText = msg;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.padding = "12px 16px";
  toast.style.background = "#00ffae";
  toast.style.color = "#000";
  toast.style.borderRadius = "8px";
  toast.style.fontSize = "13px";
  toast.style.fontWeight = "bold";
  toast.style.zIndex = "999";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 1800);
}
