/* =====================================================
   STORE LOGIC — LinkVRFz
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
  throw new Error("User doc missing");
}

const userData = snap.data();

document.getElementById("coinBalance").textContent = userData.coin;
document.getElementById("tokenBalance").textContent = userData.token;

/* =============================
   BUY HANDLER
   ============================= */

document.querySelectorAll(".buy-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const type = btn.dataset.type;
    const amount = Number(btn.dataset.amount || 0);

    if (type === "token") {
      buyToken(amount);
    }

    if (type === "premium") {
      buyPremium();
    }
  });
});

/* =============================
   BUY TOKEN
   ============================= */

async function buyToken(amount) {
  const cost = amount === 1 ? 230 : 1000;

  if (userData.coin < cost) {
    alert("Coin tidak cukup");
    return;
  }

  if (!confirm(`Beli ${amount} token seharga ${cost} coin?`)) return;

  await updateDoc(userRef, {
    coin: increment(-cost),
    token: increment(amount)
  });

  alert("Token berhasil dibeli 🎉");
  location.reload();
}

/* =============================
   BUY PREMIUM
   ============================= */

async function buyPremium() {
  if (userData.premium) {
    alert("Akun kamu sudah Premium");
    return;
  }

  if (userData.coin < 5000) {
    alert("Coin tidak cukup untuk upgrade Premium");
    return;
  }

  if (!confirm("Upgrade ke Premium seharga 5000 coin?")) return;

  await updateDoc(userRef, {
    coin: increment(-5000),
    premium: true
  });

  alert("Akun kamu sekarang PREMIUM ✨");
  location.reload();
}

