/* =====================================================
   STORE LOGIC — LinkVRFz (SECURE)
   ===================================================== */

import { auth, db } from "./firebase.js";
import { waitAuthReady } from "./auth.js";

import {
  doc,
  getDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =============================
   AUTH GUARD
   ============================= */

const user = await waitAuthReady();

if (!user) {
  sessionStorage.setItem("linkvrfz:redirect", "/store/");
  location.href = "/login/";
}

/* =============================
   LOAD USER DATA
   ============================= */

const userRef = doc(db, "users", user.uid);
const snap = await getDoc(userRef);

if (!snap.exists()) {
  alert("Data user tidak ditemukan");
  throw new Error("User document missing");
}

const userData = snap.data();

/* =============================
   RENDER BALANCE
   ============================= */

document.getElementById("coinBalance").textContent =
  userData.coin ?? 0;

document.getElementById("tokenBalance").textContent =
  userData.tokenQuota ?? 0;

/* =============================
   BUY BUTTON HANDLER
   ============================= */

document.querySelectorAll(".buy-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const type = btn.dataset.type;
    const amount = Number(btn.dataset.amount || 0);

    if (type === "token") {
      await buyToken(amount);
    }

    if (type === "premium") {
      await buyPremium();
    }
  });
});

/* =============================
   BUY TOKEN (230 COIN / TOKEN)
   ============================= */

async function buyToken(amount) {
  if (amount <= 0) return;

  const cost = amount * 230;

  if (userData.coin < cost) {
    alert("Coin tidak cukup");
    return;
  }

  const ok = confirm(
    `Beli ${amount} token seharga ${cost} coin?`
  );

  if (!ok) return;

  await updateDoc(userRef, {
    coin: increment(-cost),
    tokenQuota: increment(amount)
  });

  alert("Token berhasil dibeli 🎉");
  location.reload();
}

/* =============================
   BUY PREMIUM
   ============================= */

async function buyPremium() {
  if (userData.premium === true) {
    alert("Akun kamu sudah Premium");
    return;
  }

  const cost = 5000;

  if (userData.coin < cost) {
    alert("Coin tidak cukup untuk upgrade Premium");
    return;
  }

  const ok = confirm(
    "Upgrade ke Premium seharga 5000 coin?"
  );

  if (!ok) return;

  await updateDoc(userRef, {
    coin: increment(-cost),
    premium: true
  });

  alert("Akun kamu sekarang PREMIUM ✨");
  location.reload();
}
