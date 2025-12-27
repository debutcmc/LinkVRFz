/* =====================================================
   CREATE LINK — LinkVRFz
   FIREBASE + REALISTIC FLOW
   ===================================================== */

import { auth, db } from "./firebase.js";
import { waitAuthReady } from "./auth.js";
import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

/* =============================
   AUTH GUARD
   ============================= */

await waitAuthReady();

if (!auth.currentUser) {
  sessionStorage.setItem("linkvrfz:redirect", "/create/");
  location.href = "/login/";
}

/* =============================
   ELEMENTS
   ============================= */

const form = document.getElementById("createForm");
const resultBox = document.getElementById("result");
const overlay = document.getElementById("generateOverlay");
const loaderBox = document.getElementById("loaderState");

/* =============================
   SUBMIT
   ============================= */

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = titleEl("title");
  const description = text("description");
  const fileName = text("fileName");
  const targetUrl = titleEl("targetUrl");
  const mode = val("mode");
  const duration = Number(val("duration"));
  const antiDirect = check("antiDirect", true);
  const hideUrl = check("hideUrl", false);
  const note = text("note");

  if (!title || !targetUrl) {
    alert("Judul dan Target URL wajib diisi");
    return;
  }

  showLoader();
  simulateFlow(() => {
    saveLink({
      title,
      description,
      fileName,
      targetUrl,
      mode,
      duration,
      antiDirect,
      hideUrl,
      note
    });
  });
});

/* =============================
   SAVE LINK
   ============================= */

async function saveLink(data) {
  const expiredAt = Date.now() + data.duration * 86400000;

  const docRef = await addDoc(collection(db, "links"), {
    ownerId: auth.currentUser.uid,
    ...data,
    createdAt: Date.now(),
    expiredAt,
    stats: {
      views: 0,
      verified: 0,
      downloads: 0
    }
  });

  loaderBox.innerHTML = successIcon();

  setTimeout(() => {
    overlay.classList.add("hidden");
    showResult(docRef.id, data);
  }, 1400);
}

/* =============================
   UI HELPERS
   ============================= */

function showLoader() {
  overlay.classList.remove("hidden");
  loaderBox.innerHTML = loadingIcon("Memvalidasi URL...");
}

function simulateFlow(done) {
  const steps = [
    "Memvalidasi URL...",
    "Mengecek keamanan link...",
    "Menerapkan proteksi...",
    "Menyusun token...",
    "Finalisasi data..."
  ];

  let i = 0;
  const t = setInterval(() => {
    const p = document.getElementById("loaderText");
    if (p && i < steps.length) p.textContent = steps[i++];
  }, 800);

  setTimeout(() => {
    clearInterval(t);
    done();
  }, 3000 + Math.random() * 1500);
}

function showResult(id, payload) {
  const finalLink = `${location.origin}/download/go/?id=${id}`;
  resultBox.style.display = "block";
  resultBox.innerHTML = `
    <strong>Link Siap Digunakan</strong><br><br>
    <input value="${finalLink}" readonly onclick="this.select()" />
    <div class="meta">
      <div>Mode: <b>${payload.mode.toUpperCase()}</b></div>
      <div>Masa Aktif: ${payload.duration} hari</div>
    </div>
  `;
}

/* =============================
   MINI UTILS
   ============================= */

const titleEl = id => document.getElementById(id).value.trim();
const text = id => document.getElementById(id)?.value.trim() || "";
const val = id => document.getElementById(id).value;
const check = (id, d) => document.getElementById(id)?.checked ?? d;

const loadingIcon = txt => `
  <lord-icon src="https://cdn.lordicon.com/kozvmqsd.json"
    trigger="loop" delay="800"
    colors="primary:#4bb3fd,secondary:#4bb3fd"
    style="width:150px;height:150px"></lord-icon>
  <p id="loaderText">${txt}</p>
`;

const successIcon = () => `
  <lord-icon src="https://cdn.lordicon.com/xlayapaf.json"
    trigger="in" state="in-reveal"
    colors="primary:#ffffff,secondary:#66ee78"
    style="width:150px;height:150px"></lord-icon>
  <p style="color:#66ee78">Link berhasil dibuat</p>
`;
