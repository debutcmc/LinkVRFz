/* =====================================================
   LANDING PAGE LOGIC — LinkVRFz (UX FIXED)
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const heroPrimary = document.getElementById("heroPrimary");
  const navLoginBtn = document.getElementById("navLoginBtn");

  const user = getCurrentUser();

  /* =============================
     NAVBAR LOGIN BUTTON
     ============================= */
  if (user) {
    navLoginBtn.textContent = "Dashboard";
    navLoginBtn.href = "/dashboard/";
  } else {
    navLoginBtn.textContent = "Login";
    navLoginBtn.href = "/login/";
  }

  /* =============================
     HERO CTA CLICK GUARD
     ============================= */
  heroPrimary.addEventListener("click", (e) => {
    if (!user) {
      e.preventDefault();
      redirectToLoginWithReason();
    }
  });

  /* =============================
     LORDICON FIX
     ============================= */
  forceLordiconReload();
});

/* =====================================================
   AUTH (TEMP)
   ===================================================== */

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("linkvrfz:user"));
  } catch {
    return null;
  }
}

/* =====================================================
   LOGIN REDIRECT UX
   ===================================================== */

function redirectToLoginWithReason() {
  sessionStorage.setItem(
    "linkvrfz:redirect",
    location.pathname
  );

  alert("Login dulu untuk membuat link ✨");
  location.href = "/login/";
}

/* =====================================================
   LORDICON FIX
   ===================================================== */

function forceLordiconReload() {
  if (!window.customElements?.get("lord-icon")) return;

  document.querySelectorAll("lord-icon").forEach(icon => {
    const src = icon.getAttribute("src");
    icon.removeAttribute("src");
    setTimeout(() => icon.setAttribute("src", src), 50);
  });
}
