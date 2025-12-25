function generateLink() {
  const to = document.getElementById("to").value.trim();
  const name = document.getElementById("name").value.trim() || "Untitled";
  const mode = document.getElementById("mode").value;
  const result = document.getElementById("result");
  const list = document.getElementById("list");

  if (!to) {
    result.innerHTML = "❌ Link wajib diisi";
    return;
  }

  let url;
  try {
    url = new URL(to);
  } catch {
    result.innerHTML = "❌ Link tidak valid";
    return;
  }

  const id = Math.random().toString(36).substring(2, 10);
  const finalLink =
    `${location.origin}/download/go?id=${id}&mode=${mode}&to=${encodeURIComponent(to)}`;

  // tampilkan hasil cepat
  result.innerHTML = `
    <strong>Link terbaru:</strong><br>
    <input value="${finalLink}" onclick="this.select()" style="width:100%;padding:8px;">
  `;

  // tambah card ke bawah
  const card = document.createElement("div");
  card.className = "link-card";
  card.innerHTML = `
    <div class="link-row"><strong>Nama:</strong> ${name}</div>
    <div class="link-row"><strong>File:</strong> ${url.pathname.split("/").pop()}</div>
    <div class="link-row"><strong>Type:</strong> ${mode}</div>
    <div class="link-row"><strong>Link:</strong> ${finalLink}</div>
    <button class="copy-btn" onclick="copyText('${finalLink}')">Copy</button>
  `;

  list.prepend(card);
}

function copyText(text) {
  navigator.clipboard.writeText(text);
  alert("Link dicopy");
}
