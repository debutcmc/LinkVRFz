<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Create — LinkVRFz</title>

  <!-- GLOBAL STYLE -->
  <link rel="stylesheet" href="/css/style.css">

  <!-- PAGE SCRIPT -->
  <script src="/js/create.js" defer></script>
</head>
<body>

<!-- DASHBOARD NAV -->
<header class="dash-nav">
  <div class="logo">LinkVRFz</div>
  <span class="badge">Dashboard</span>
</header>

<!-- CREATOR WORKSPACE -->
<main class="workspace">

  <!-- TITLE -->
  <h2 style="margin-bottom:8px;">Generate Verified Link</h2>
  <p style="color:#aaa;font-size:14px;margin-bottom:12px;">
    Tempel link file kamu, pilih mode, lalu generate link verifikasi
  </p>

  <!-- INPUT LINK -->
  <input
    id="to"
    type="url"
    class="big-input"
    placeholder="Tempel link download (Drive / Mediafire / .zip / .apk)"
    required
  >

  <!-- INPUT NAME -->
  <input
    id="name"
    type="text"
    class="big-input"
    placeholder="Nama link (contoh: Addon Keren MC)"
    required
  >

  <!-- MODE SELECT -->
  <select id="mode" class="big-select">
    <option value="easy">Easy (cepat)</option>
    <option value="medium" selected>Medium (rekomendasi)</option>
    <option value="hard">Hard (maksimal)</option>
  </select>

  <!-- GENERATE BUTTON -->
  <button class="big-btn" onclick="generateLink()">
    GENERATE LINK
  </button>

  <!-- RESULT AREA -->
  <div id="mainResult" class="result-area">
    Hasil link akan muncul di sini
  </div>

  <!-- GENERATED LINK LIST -->
  <div class="list-area" id="historyList">
    <!-- link-card akan di-inject oleh JS -->
  </div>

</main>

</body>
</html>
