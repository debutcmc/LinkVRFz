/* =====================================================
   HISTORY PAGE — LinkVRFz (FINAL SAFE VERSION)
   ===================================================== */

import { db } from "./firebase.js";
import { waitAuthReady } from "./auth.js";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =============================
   AUTH GUARD
   ============================= */

const user = await waitAuthReady();

if (!user) {
  sessionStorage.setItem("linkvrfz:redirect", "/history/");
  location.href = "/login/";
  throw new Error("Not authenticated");
}

/* =============================
   LOAD HISTORY
   ============================= */

const listEl = document.getElementById("historyList");
listEl.innerHTML = "<p class='loading'>Memuat history...</p>";

let snap;
try {
  const q = query(
    collection(db, "links"),
    where("ownerId", "==", user.uid)
  );

  snap = await getDocs(q);
} catch (err) {
  console.error(err);
  listEl.innerHTML = "<p class='loading'>Gagal memuat history</p>";
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

  let status = "active";
  let statusText = "Aktif";

  const remain = data.expiredAt - now;

  if (remain <= 0) {
    status = "expired";
    statusText = "Expired";
  } else if (remain < 86400000 * 2) {
    status = "soon";
    statusText = "Hampir Habis";
  }

  const card = document.createElement("div");
  card.className = "history-card";

  card.innerHTML = `
    <div class="history-info">
      <h3>${data.title || "Tanpa Judul"}</h3>

      <div class="history-meta">
        <span class="status ${status}">${statusText}</span>
        Dibuat: ${
          data.createdAt
            ? new Date(data.createdAt).toLocaleDateString()
            : "-"
        }
      </div>
    </div>

    <div class="history-action">
      <button class="small-btn" onclick="copyLink('${docSnap.id}')">
        Copy Link
      </button>

      ${
        status === "expired"
          ? `<button class="small-btn danger" onclick="requestExtend('${docSnap.id}')">
               Perpanjang
             </button>`
          : ""
      }
    </div>
  `;

  listEl.appendChild(card);
});

/* =============================
   ACTIONS
   ============================= */

window.copyLink = function (id) {
  const link = `${location.origin}/go/?id=${id}`;
  navigator.clipboard.writeText(link);
  alert("Link disalin ✔");
};

/**
 * ⚠️ AMAN:
 * - Coin dikurangi
 * - Flag extend request dibuat
 * - expiredAt TIDAK diubah di client
 */
window.requestExtend = async function (id) {
  if (!confirm("Ajukan perpanjangan link? (230 coin)")) return;

  const userRef = doc(db, "users", user.uid);
  const linkRef = doc(db, "links", id);

  try {
    await updateDoc(userRef, {
      coin: increment(-230)
    });

    await updateDoc(linkRef, {
      extendRequested: true,
      extendRequestedAt: serverTimestamp()
    });

    alert("Permintaan perpanjangan dikirim ✔");
    location.reload();
  } catch (err) {
    console.error(err);
    alert("Gagal mengajukan perpanjangan");
  }
};
