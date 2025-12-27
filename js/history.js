/* =====================================================
   HISTORY PAGE — LinkVRFz
   ===================================================== */

import { auth, db } from "./firebase.js";
import { waitAuthReady } from "./auth.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment
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
   LOAD HISTORY
   ============================= */

const listEl = document.getElementById("historyList");

const q = query(
  collection(db, "links"),
  where("ownerId", "==", user.uid)
);

const snap = await getDocs(q);

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
        Dibuat: ${new Date(data.createdAt).toLocaleDateString()}
      </div>
    </div>

    <div class="history-action">
      <button onclick="copyLink('${docSnap.id}')">Copy Link</button>
      ${status !== "expired" ? "" : `
        <button onclick="extendLink('${docSnap.id}')">
          Perpanjang
        </button>
      `}
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

window.extendLink = async function (id) {
  if (!confirm("Perpanjang link 1 hari (230 coin)?")) return;

  const userRef = doc(db, "users", user.uid);
  const linkRef = doc(db, "links", id);

  await updateDoc(userRef, {
    coin: increment(-230)
  });

  await updateDoc(linkRef, {
    expiredAt: Date.now() + 86400000
  });

  alert("Link diperpanjang ✔");
  location.reload();
};
