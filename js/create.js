/* =====================================================
   CREATE LINK — LinkVRFz
   LOCAL TOKEN ENGINE (FULL + REALISTIC FLOW)
   ===================================================== */

const form = document.getElementById("createForm");
const resultBox = document.getElementById("result");

/* OVERLAY ELEMENT */
const overlay = document.getElementById("generateOverlay");
const loaderBox = document.getElementById("loaderState");
const loaderText = document.getElementById("loaderText");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  /* =============================
     GET FORM VALUES
     ============================= */
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description")?.value.trim() || "";
  const fileName = document.getElementById("fileName")?.value.trim() || "";
  const targetUrl = document.getElementById("targetUrl").value.trim();
  const mode = document.getElementById("mode").value;
  const duration = Number(document.getElementById("duration").value);

  const antiDirect =
    document.getElementById("antiDirect")?.checked ?? true;
  const hideUrl =
    document.getElementById("hideUrl")?.checked ?? false;
  const note =
    document.getElementById("note")?.value.trim() || "";

  if (!title || !targetUrl) {
    alert("Judul dan Target URL wajib diisi");
    return;
  }

  /* =============================
     SHOW FAKE GENERATE OVERLAY
     ============================= */
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

/* =====================================================
   FINISH GENERATE
   ===================================================== */

function finishGenerate(data) {
  /* =============================
     GENERATE TOKEN
     ============================= */
  const token = generateToken(data.title, data.targetUrl);

  /* =============================
     EXPIRE TIME
     ============================= */
  const expiredAt =
    Date.now() + data.duration * 24 * 60 * 60 * 1000;

  /* =============================
     BUILD PAYLOAD
     ============================= */
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

  /* =============================
     SAVE TO LOCAL STORAGE
     ============================= */
  localStorage.setItem(
    "linkvrfz:" + token,
    JSON.stringify(payload)
  );

  /* =============================
     SUCCESS STATE
     ============================= */
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

/* =====================================================
   SHOW RESULT
   ===================================================== */

function showResult(token, payload) {
  const finalLink =
    `${location.origin}/download/go/?v=${token}`;

  resultBox.style.display = "block";
  resultBox.innerHTML = `
    <strong>Link Siap Digunakan</strong><br><br>

    <input
      type="text"
      value="${finalLink}"
      readonly
      onclick="this.select()"
    />

    <div style="margin-top:12px;font-size:12px;color:#aaa">
      <div>Mode: <b>${payload.mode.toUpperCase()}</b></div>
      <div>Masa Aktif: ${payload.duration} hari</div>
      <div>Anti Direct: ${payload.antiDirect ? "ON" : "OFF"}</div>
      <div>Hide URL: ${payload.hideUrl ? "ON" : "OFF"}</div>
    </div>
  `;
}

/* =====================================================
   TOKEN ENGINE (ANTI NEBAK)
   ===================================================== */

function generateToken(title, url) {
  const rand = randomString(6);
  const sig = simpleHash(title + url).slice(0, 6);
  return `${rand}-${sig}`;
}

function randomString(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
