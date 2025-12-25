function generateLink() {
  const toInput = document.getElementById("to");
  const nameInput = document.getElementById("name");
  const modeSelect = document.getElementById("mode");
  const result = document.getElementById("result");
  const list = document.getElementById("list");

  const to = toInput.value.trim();
  const name = nameInput.value.trim() || "Untitled";
  const mode = modeSelect.value;

  if (!to) {
    result.innerHTML = "❌ Link download wajib diisi";
    return;
  }

  let url;
  try {
    url = new URL(to);
  } catch {
    result.innerHTML = "❌ Format link tidak valid";
    return;
  }

  const id = Math.random().toString(36).slice(2, 10);
  const finalLink =
    `${location.origin}/download/go?id=${id}&mode=${mode}&to=${encodeURIComponent(to)}`;

  /* RESULT CEPAT */
  result.innerHTML = `
    <strong>Link berhasil dibuat:</strong><br><br>
    <input value="${finalLink}" onclick="this.select()" 
      style="width:100%;padding:10px;border-radius:6px;border:1px solid #222;background:#0f0f0f;color:#fff;">
  `;

  /* CARD */
  const card = document.createElement("div");
  card.className = "link-card";

  card.innerHTML = `
    <div class="row"><strong>Nama:</strong> ${name}</div>
    <div class="row"><strong>File:</strong> ${url.pathname.split("/").pop() || "-"}</div>
    <div class="row"><strong>Type:</strong> ${mode}</div>
    <div class="row"><strong>Link:</strong> ${finalLink}</div>
    <button class="copy-btn">Copy</button>
  `;

  card.querySelector(".copy-btn").onclick = () => {
    navigator.clipboard.writeText(finalLink);
    alert("Link berhasil dicopy");
  };

  list.prepend(card);

  /* optional: reset input */
  toInput.value = "";
}
