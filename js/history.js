/* =====================================================
   HISTORY PAGE — LinkVRFz (FINAL & SAFE)
   ===================================================== */

import { auth, db } from "./firebase.js";
import { waitAuthReady } from "./auth.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =============================
   AUTH GUARD
   ============================= */

const user = await waitAuthReady();

if (!user) {
  sessionStorage.setItem("linkvrfz:redirect", "/history/");
  location.href = "/login/";
}

/* =============================
   ELEMENT
   ============================= */

const listEl = document.getElementById("historyList");

/* =============================
   LOAD HISTORY
   ============================= */

const q = query(
  collection(db, "links"),
  where("ownerId", "==", user.uid)
);

let snap;
try {
  snap = await getDocs(q);
} catch (err) {
  console.error(err);
  listEl.innerHTML = "<p class='loading'>Gagal memuat data</p>";
  throw err;
}

listEl.innerHTML = "";

if (snap.empty) {
  listEl.innerHTML = "<p class='loading'>Belum ada link dibuat</p>";
}

/* =============================
   RENDER
   ============================= */

snap.forEach(docSnap => {
  const data = docSnap.data();
  const now = Date.now();

  const expiredAt = data.expiredAt;
  const warnAt = data.warnAt || (expiredAt - 86400000); // fallback 1 hari

  let status = "active";
  let statusText = "Aktif";

  if (now >= expiredAt) {
    status = "expired";
    statusText = "Expired";
  } else if (now >= warnAt) {
    status = "soon";
    statusText = "Hampir Habis";
  }

  const remainMs = Math.max(expiredAt - now, 0);
  const remainText = formatRemain(remainMs);

  const card = document.createElement("div");
  card.className = "history-card";

  card.innerHTML = `
    <div class="history-info">
      <h3>${escapeHtml(data.title || "Tanpa Judul")}</h3>
      <div class="history-meta">
        <span class="status ${status}">${statusText}</span>
        Sisa: ${remainText}<br>
        Dibuat: ${new Date(data.createdAt).toLocaleDateString()}
      </div>
    </div>

    <div class="history-action">
      <button onclick="copyLink('${docSnap.id}')">Copy Link</button>

      ${status !== "active" ? `
        <button onclick="extendLink('${docSnap.id}')">
          Perpanjang
        </button>
      ` : ""}
    </div>
  `;

  listEl.appendChild(card);
});

/* =============================
   ACTIONS
   ============================= */

window.copyLink = function (id) {
  const link = `${location.origin}/download/go/?id=${id}`;
  navigator.clipboard.writeText(link);
  alert("Link disalin");
};

window.extendLink = function (id) {
  alert(
    "⚠️ Perpanjangan link akan diproses via sistem.\n" +
    "Pastikan coin kamu cukup."
  );

  // ⛔️ SENGAJA BELUM UPDATE DI CLIENT
  // nanti kita pindahkan ke Cloud Function
};

/* =============================
   HELPERS
   ============================= */

function formatRemain(ms) {
  if (ms <= 0) return "0 menit";

  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);

  if (d > 0) return `${d} hari`;
  if (h > 0) return `${h} jam`;
  if (m > 0) return `${m} menit`;
  return `${s} detik`;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}
