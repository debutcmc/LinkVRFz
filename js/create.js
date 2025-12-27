/* =====================================================
   CREATE LINK — LinkVRFz (SECURE)
   ===================================================== */

import { auth, db } from "./firebase.js";
import { waitAuthReady } from "./auth.js";

import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ================= AUTH GUARD ================= */

await waitAuthReady();

if (!auth.currentUser) {
  sessionStorage.setItem("linkvrfz:redirect", "/create/");
  location.href = "/login/";
}

/* ================= ELEMENT ================= */

const form = document.getElementById("createForm");
const overlay = document.getElementById("generateOverlay");
const loaderBox = document.getElementById("loaderState");
const resultBox = document.getElementById("result");

/* ================= SUBMIT ================= */

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const uid = auth.currentUser.uid;
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    alert("User data tidak valid");
    return;
  }

  const user = userSnap.data();

  if (user.tokenQuota <= 0) {
    alert("Token habis. Beli token untuk lanjut.");
    return;
  }

  showLoader();

  const data = {
    title: val("title"),
    description: text("description"),
    fileName: text("fileName"),
    targetUrl: val("targetUrl"),
    mode: val("mode"),
    duration: Number(val("duration")),
    antiDirect: check("antiDirect", true),
    hideUrl: check("hideUrl", false),
    note: text("note")
  };

  const expiredAt = Date.now() + data.duration * 86400000;

  const docRef = await addDoc(collection(db, "links"), {
    ownerId: uid,
    ...data,
    status: "active",
    createdAt: Date.now(),
    expiredAt,
    stats: { views: 0, verified: 0, downloads: 0 }
  });

  await updateDoc(userRef, {
    tokenQuota: increment(-1),
    totalLink: increment(1)
  });

  loaderBox.innerHTML = successIcon();

  setTimeout(() => {
    overlay.classList.add("hidden");
    showResult(docRef.id);
  }, 1200);
});

/* ================= UI ================= */

const val = id => document.getElementById(id).value.trim();
const text = id => document.getElementById(id)?.value.trim() || "";
const check = (id, d) => document.getElementById(id)?.checked ?? d;

function showLoader() {
  overlay.classList.remove("hidden");
  loaderBox.innerHTML = `
    <lord-icon src="https://cdn.lordicon.com/kozvmqsd.json"
      trigger="loop" delay="800"
      colors="primary:#4bb3fd,secondary:#4bb3fd"
      style="width:150px;height:150px"></lord-icon>
    <p>Menyusun & mengamankan link...</p>
  `;
}

function successIcon() {
  return `
    <lord-icon src="https://cdn.lordicon.com/xlayapaf.json"
      trigger="in" state="in-reveal"
      colors="primary:#ffffff,secondary:#66ee78"
      style="width:150px;height:150px"></lord-icon>
    <p style="color:#66ee78">Link berhasil dibuat</p>
  `;
}

function showResult(id) {
  const link = `${location.origin}/download/go/?id=${id}`;
  resultBox.style.display = "block";
  resultBox.innerHTML = `<input value="${link}" readonly onclick="this.select()">`;
}
