/* =====================================================
   CREATE LINK — LinkVRFz
   LOCAL TOKEN ENGINE (FULL VERSION)
   ===================================================== */

const form = document.getElementById("createForm");
const resultBox = document.getElementById("result");

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
     GENERATE TOKEN
     ============================= */
  const token = generateToken(title, targetUrl);

  /* =============================
     EXPIRE TIME
     ============================= */
  const expiredAt =
    Date.now() + duration * 24 * 60 * 60 * 1000;

  /* =============================
     BUILD PAYLOAD
     ============================= */
  const payload = {
    title,
    description,
    fileName,
    targetUrl,
    mode,
    duration,
    antiDirect,
    hideUrl,
    note,

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
     FINAL LINK
     ============================= */
  const finalLink =
    `${location.origin}/download/go/?v=${token}`;

  /* =============================
     SHOW RESULT
     ============================= */
  resultBox.style.display = "block";
  resultBox.innerHTML = `
    <strong>Link berhasil dibuat</strong><br><br>

    <input type="text"
      value="${finalLink}"
      readonly
      onclick="this.select()"
    />

    <div style="margin-top:10px;font-size:12px;color:#aaa">
      <div>Mode: <b>${mode.toUpperCase()}</b></div>
      <div>Masa aktif: ${duration} hari</div>
      <div>Anti Direct: ${antiDirect ? "ON" : "OFF"}</div>
      <div>Hide URL: ${hideUrl ? "ON" : "OFF"}</div>
    </div>
  `;
});

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
