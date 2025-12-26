// /js/auth.js
import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* =============================
   GLOBAL AUTH STATE
   ============================= */

let currentUser = null;
let authReady = false;
const listeners = [];

/* =============================
   AUTH OBSERVER
   ============================= */

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  authReady = true;

  // notify listeners
  listeners.forEach(cb => cb(user));
});

/* =============================
   PUBLIC API
   ============================= */

/**
 * Tunggu auth siap (dipakai halaman lain)
 */
export function waitAuthReady() {
  return new Promise((resolve) => {
    if (authReady) {
      resolve(currentUser);
    } else {
      listeners.push(resolve);
    }
  });
}

/**
 * Ambil user aktif (boleh null)
 */
export function getCurrentUser() {
  return currentUser;
}

/**
 * Check login (boolean)
 */
export function isLoggedIn() {
  return !!currentUser;
}

/**
 * Logout helper
 */
export async function logout() {
  await signOut(auth);
  location.href = "/login/";
}
