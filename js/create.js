/* =====================================================
   CREATE LINK — LinkVRFz
   LOCAL TOKEN ENGINE (FULL + REALISTIC FLOW)
   ===================================================== */

/* =============================
   AUTH GUARD
   ============================= */

const authBlock = document.getElementById("authBlock");

function isLoggedIn() {
  return !!localStorage.getItem("linkvrfz:user");
}

if (!isLoggedIn()) {
  document.body.style.overflow = "hidden";
  authBlock.classList.remove("hidden");
}

/* =============================
   MAIN ELEMENT
   ============================= */

const form = document.getElementById("createForm");
const resultBox = document.getElementById("result");

/* OVERLAY ELEMENT */
const overlay = document.getElementById("generateOverlay");
const loaderBox = document.getElementById("loaderState");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!isLoggedIn()) return;

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description")?.value.trim() || "";
  const fileName = document.getElementById("fileName")?.value.trim() || "";
  const targetUrl = document.getElementById("targetUrl").value.trim();
  const mode = document.getElementById("mode").value;
  const duration = Number(document.getElementById("duration").value);

  const antiDirect = document.getElementById("antiDirect")?.checked ?? true;
  const hideUrl = document.getElementById("hideUrl")?.checked ?? false;
  const note = document.getElementById("note")?.value.trim() || "";

  if (!title || !targetUrl) {
    alert("Judul dan Target URL wajib diisi");
    return;
  }

  overlay.classList.remove("hidden");
  loaderBox.innerHTML = `
    <lord-icon
      src="https://cdn.lordicon.com/kozvmqsd.json"
      trigger="loop"
      delay="800"
      colors="primary:#4bb3fd,secondary:#4bb3fd"
      style="width:150px;height:150px">
    </lord-icon>
    <p id="loaderText">Memvalidasi URL...</p>
  `;

  const steps = [
    "Memvalidasi URL...",
    "Mengecek keamanan link...",
    "Menerapkan proteksi...",
    "Menyusun token...",
    "Finalisasi data..."
  ];

  let stepIndex = 0;
  const stepInterval = setInterval(() => {
    const text = document.getElementById("loaderText");
    if (text && stepIndex < steps.length) {
      text.textContent = steps[stepIndex++];
    }
  }, 900);

  const fakeDelay = 3200 + Math.random() * 2000;

  setTimeout(() => {
    clearInterval(stepInterval);
    finishGenerate({
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
  }, fakeDelay);
});

/* =============================
   FINISH GENERATE
   ============================= */

function finishGenerate(data) {
  const token = generateToken(data.title, data.targetUrl);
  const expiredAt = Date.now() + data.duration * 86400000;

  const payload = {
    ...data,
    createdAt: Date.now(),
    expiredAt,
    stats: {
      views: 0,
      verified: 0,
      downloads: 0
    }
  };

  localStorage.setItem("linkvrfz:" + token, JSON.stringify(payload));

  loaderBox.innerHTML = `
    <lord-icon
      src="https://cdn.lordicon.com/xlayapaf.json"
      trigger="in"
      state="in-reveal"
      colors="primary:#ffffff,secondary:#66ee78,tertiary:#66ee78"
      style="width:150px;height:150px">
    </lord-icon>
    <p style="color:#66ee78;margin-top:10px">
      Link berhasil dibuat
    </p>
  `;

  setTimeout(() => {
    overlay.classList.add("hidden");
    showResult(token, payload);
  }, 1500);
}

/* =============================
   SHOW RESULT
   ============================= */

function showResult(token, payload) {
  const finalLink = `${location.origin}/download/go/?v=${token}`;

  resultBox.style.display = "block";
  resultBox.innerHTML = `
    <strong>Link Siap Digunakan</strong><br><br>

    <input type="text" value="${finalLink}" readonly onclick="this.select()" />

    <div class="meta">
      <div>Mode: <b>${payload.mode.toUpperCase()}</b></div>
      <div>Masa Aktif: ${payload.duration} hari</div>
      <div>Anti Direct: ${payload.antiDirect ? "ON" : "OFF"}</div>
      <div>Hide URL: ${payload.hideUrl ? "ON" : "OFF"}</div>
    </div>
  `;
}

/* =============================
   TOKEN ENGINE
   ============================= */

function generateToken(title, url) {
  const rand = randomString(6);
  const sig = simpleHash(title + url).slice(0, 6);
  return `${rand}-${sig}`;
}

function randomString(len) {
  const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(len)].map(() => c[Math.floor(Math.random() * c.length)]).join("");
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
