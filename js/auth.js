// /js/auth.js
import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let currentUser = null;
let authReady = false;
const listeners = [];

/* ================= AUTH OBSERVER ================= */

onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  authReady = true;

  if (user) {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    // ✅ USER DOC HANYA DIBUAT DI SINI (SINGLE SOURCE OF TRUTH)
    if (!snap.exists()) {
      await setDoc(ref, {
        email: user.email,
        role: "user",
        premium: false,

        coin: 300,
        tokenQuota: 15,
        totalLink: 0,

        createdAt: Date.now()
      });
    }
  }

  listeners.forEach(cb => cb(user));
});

/* ================= PUBLIC ================= */

export function waitAuthReady() {
  return new Promise((resolve) => {
    if (authReady) resolve(currentUser);
    else listeners.push(resolve);
  });
}

export function getCurrentUser() {
  return currentUser;
}

/* ================= LOGIN ================= */

export async function login(email, password) {
  if (!email || !password) {
    throw new Error("Email dan password wajib diisi");
  }

  await signInWithEmailAndPassword(auth, email, password);

  const redirect = sessionStorage.getItem("linkvrfz:redirect");
  sessionStorage.removeItem("linkvrfz:redirect");

  location.href = redirect || "/dashboard/";
}

/* ================= REGISTER ================= */

export async function register(email, password) {
  if (!email || !password) {
    throw new Error("Email dan password wajib diisi");
  }

  if (password.length < 6) {
    throw new Error("Password minimal 6 karakter");
  }

  // ❌ TIDAK BOLEH setDoc DI SINI (ANTI DOUBLE CREATE)
  await createUserWithEmailAndPassword(auth, email, password);

  // user doc akan dibuat oleh auth observer
  location.href = "/dashboard/";
}

/* ================= LOGOUT ================= */

export async function logout() {
  await signOut(auth);
  location.href = "/login/";
}
