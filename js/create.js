import { auth } from "./firebase.js";
import { initAuthGuard, logout } from "./auth.js";
import { createLink } from "./db.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

initAuthGuard(false);

/* ========================= */
/* LOGOUT */
/* ========================= */
document.getElementById("logoutBtn").onclick = logout;

/* ========================= */
/* HELPERS */
/* ========================= */
function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

async function hashString(str) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/* ========================= */
/* CREATE LINK */
/* ========================= */
onAuthStateChanged(auth, (user) => {
  if (!user) return;

  const form = document.getElementById("createForm");
  const result = document.getElementById("result");

  form.onsubmit = async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const targetUrl = document.getElementById("targetUrl").value.trim();
    const duration = parseInt(document.getElementById("duration").value);

    if (!title || !targetUrl) {
      alert("Semua field wajib diisi");
      return;
    }

    const fileHash = await hashString(targetUrl + user.uid);
    const expiresAt = addDays(duration);

    const docRef = await createLink(user.uid, {
      title,
      targetUrl,
      fileHash,
      expiresAt
    });

    const finalLink =
      `${location.origin}/go/?id=${docRef.id}`;

    result.style.display = "block";
    result.innerHTML = `
      <p>✅ Link berhasil dibuat</p>
      <input value="${finalLink}" readonly />
    `;

    form.reset();
  };
});
