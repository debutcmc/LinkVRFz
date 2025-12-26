/* =====================================================
   LANDING PAGE — LinkVRFz
   ===================================================== */

import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* =============================
   ELEMENTS
   ============================= */
const nav = document.querySelector(".nav");
const createBtn = document.querySelector(".btn.primary");
const downloadBtn = document.querySelector(".btn.secondary");

/* =============================
   AUTH STATE
   ============================= */
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.uid);

    // Ubah CTA utama
    if (createBtn) {
      createBtn.textContent = "Dashboard";
      createBtn.href = "/dashboard/";
    }

  } else {
    console.log("User not logged in");

    if (createBtn) {
      createBtn.textContent = "Buat Link";
      createBtn.href = "/create/";
    }
  }
});

/* =============================
   NAVBAR SCROLL EFFECT
   ============================= */
window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    nav.classList.add("nav-scrolled");
  } else {
    nav.classList.remove("nav-scrolled");
  }
});
