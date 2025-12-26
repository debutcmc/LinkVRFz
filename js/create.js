/* =====================================================
   CREATE LINK — LinkVRFz
   Step 1 : Local Token Generator (TEST MODE)
   ===================================================== */

const form = document.getElementById("createForm");
const resultBox = document.getElementById("result");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const targetUrl = document.getElementById("targetUrl").value.trim();
  const duration = document.getElementById("duration").value;

  if (!title || !targetUrl) {
    alert("Semua field wajib diisi");
    return;
  }

  /* ============================= */
  /* GENERATE SECURE TOKEN */
  /* ============================= */
  const token = generateToken(title, targetUrl);

  /* ============================= */
  /* BUILD FINAL LINK */
  /* ============================= */
  const finalLink =
    `${location.origin}/download/go/?v=${token}`;

  /* ============================= */
  /* SHOW RESULT */
  /* ============================= */
  resultBox.style.display = "block";
  resultBox.innerHTML = `
    <strong>Link berhasil dibuat</strong><br><br>
    <input type="text" value="${finalLink}" readonly onclick="this.select()" />
    <p style="font-size:12px;color:#666;margin-top:6px">
      Masa aktif: ${duration} hari
    </p>
  `;
});

/* =====================================================
   TOKEN ENGINE (ANTI NEBAK)
   ===================================================== */

/**
 * Token = random + hash mini dari isi link
 * contoh: v8X9kA-qF3dP
 */
function generateToken(title, url) {
  const rand = randomString(6);
  const sig = simpleHash(title + url).slice(0, 6);
  return `${rand}-${sig}`;
}

/**
 * Random huruf + angka
 */
function randomString(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
}

/**
 * Hash ringan (bukan crypto berat)
 * Tujuan: token gak cuma random
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
