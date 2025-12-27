/* =====================================================
   LANDING PAGE LOGIC — LinkVRFz (FINAL)
   ===================================================== */

import { auth, db } from "./firebase.js";
import { waitAuthReady } from "./auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const navLogin = document.getElementById("navLogin");
  const navProfile = document.getElementById("navProfile");
  const profileLabel = document.getElementById("profileLabel");
  const heroPrimary = document.getElementById("heroPrimary");

  const user = await waitAuthReady();

  /* =============================
     AUTH UI SWITCH
     ============================= */

  if (user) {
    // hide login
    navLogin.style.display = "none";

    // show profile
    navProfile.classList.remove("hidden");

    // load user data
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      const data = snap.data();
      profileLabel.textContent = data.premium ? "PREMIUM" : "FREE";
      profileLabel.className = data.premium ? "badge premium" : "badge free";
    }
  } else {
    navLogin.style.display = "inline-flex";
    navProfile.classList.add("hidden");

    // guard hero button
    heroPrimary.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.setItem("linkvrfz:redirect", "/create/");
      alert("Login dulu untuk membuat link ✨");
      location.href = "/login/";
    });
  }

  forceLordiconReload();
});

/* =============================
   LORDICON FIX
   ============================= */
function forceLordiconReload() {
  if (!window.customElements?.get("lord-icon")) return;

  document.querySelectorAll("lord-icon").forEach(icon => {
    const src = icon.getAttribute("src");
    icon.removeAttribute("src");
    setTimeout(() => icon.setAttribute("src", src), 50);
  });
}
