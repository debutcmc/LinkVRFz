/* =====================================================
   LANDING PAGE LOGIC — LinkVRFz
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const navAuth = document.getElementById("navAuth");
  const heroPrimary = document.getElementById("heroPrimary");

  const user = getCurrentUser();

  /* =============================
     AUTH STATE UI
     ============================= */
  if (user) {
    // Navbar
    navAuth.textContent = "Dashboard";
    navAuth.href = "/dashboard/";

    // Hero button
    heroPrimary.textContent = "Dashboard";
    heroPrimary.href = "/dashboard/";
  } else {
    // Belum login
    navAuth.textContent = "Login";
    navAuth.href = "/login/";

    heroPrimary.textContent = "Buat Link";
    heroPrimary.href = "/login/";
  }

  /* =============================
     FORCE LORDICON REFRESH
     (fix icon gak muncul di device lain)
     ============================= */
  forceLordiconReload();
});

/* =====================================================
   SIMULATED AUTH (TEMP)
   ===================================================== */

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("linkvrfz:user"));
  } catch {
    return null;
  }
}

/* =====================================================
   LORDICON FIX
   ===================================================== */

function forceLordiconReload() {
  if (!window.customElements?.get("lord-icon")) return;

  document.querySelectorAll("lord-icon").forEach(icon => {
    const src = icon.getAttribute("src");
    icon.removeAttribute("src");

    // trigger reload
    setTimeout(() => {
      icon.setAttribute("src", src);
    }, 50);
  });
}
