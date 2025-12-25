function generateLink() {
  const toInput = document.getElementById("to");
  const mode = document.getElementById("mode").value;
  const resultBox = document.getElementById("result");

  const to = toInput.value.trim();

  // validasi kosong
  if (!to) {
    resultBox.innerHTML = `<span style="color:#ff6b6b;">❌ Link download wajib diisi</span>`;
    return;
  }

  // validasi URL sederhana
  try {
    new URL(to);
  } catch {
    resultBox.innerHTML = `<span style="color:#ff6b6b;">❌ Format link tidak valid</span>`;
    return;
  }

  const encodedTo = encodeURIComponent(to);
  const baseUrl = window.location.origin;

  // generate ID simpel (biar keliatan niat)
  const id = Math.random().toString(36).substring(2, 8);

  const finalLink = `${baseUrl}/download/go?to=${encodedTo}&mode=${mode}&id=${id}`;

  resultBox.innerHTML = `
    <div style="margin-bottom:8px;color:#00ffae;font-weight:bold;">
      ✅ Link berhasil dibuat
    </div>

    <input
      id="generatedLink"
      value="${finalLink}"
      readonly
      style="width:100%;padding:10px;border-radius:6px;border:1px solid #222;background:#0f0f0f;color:#fff;"
    >

    <button
      onclick="copyLink()"
      style="margin-top:10px;width:100%;padding:10px;border-radius:6px;background:#00ffae;color:#000;font-weight:bold;border:none;cursor:pointer;"
    >
      Copy Link
    </button>

    <small style="color:#888;display:block;margin-top:6px;">
      Mode: <b>${mode.toUpperCase()}</b> • ID: ${id}
    </small>
  `;
}

function copyLink() {
  const input = document.getElementById("generatedLink");
  input.select();
  input.setSelectionRange(0, 99999);
  document.execCommand("copy");

  alert("Link berhasil dicopy!");
}
