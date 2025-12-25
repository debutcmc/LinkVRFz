function generateLink() {
  const to = document.getElementById("to").value.trim();
  const mode = document.getElementById("mode").value;

  if (!to) {
    alert("Link download wajib diisi!");
    return;
  }

  const encodedTo = encodeURIComponent(to);
  const baseUrl = window.location.origin;

  const finalLink =
    `${baseUrl}/download/go?to=${encodedTo}&mode=${mode}`;

  document.getElementById("result").innerHTML = `
    <strong>Link kamu:</strong><br>
    <input value="${finalLink}" onclick="this.select()" style="width:100%;padding:8px;margin-top:8px;">
    <small>Klik untuk copy</small>
  `;
}

