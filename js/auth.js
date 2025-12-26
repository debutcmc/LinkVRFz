// /js/auth.js
import { auth } from "./firebase.js";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* ========================= */
/* LOGIN */
/* ========================= */
export function login(email, password) {
  if (!email || !password) {
    throw new Error("Email dan password wajib diisi");
  }

  return signInWithEmailAndPassword(auth, email, password);
}

/* ========================= */
/* REGISTER */
/* ========================= */
export function register(email, password) {
  if (!email || !password) {
    throw new Error("Email dan password wajib diisi");
  }

  if (password.length < 6) {
    throw new Error("Password minimal 6 karakter");
  }

  return createUserWithEmailAndPassword(auth, email, password);
}

/* ========================= */
/* LOGOUT */
/* ========================= */
export function logout() {
  return signOut(auth);
}

/* ========================= */
/* AUTH GUARD */
/* ========================= */
/**
 * @param {Object} options
 * options.requireAuth = true  → halaman protected
 * options.redirectTo = "/login/"
 */
export function initAuthGuard({
  requireAuth = false,
  redirectTo = "/login/"
} = {}) {
  onAuthStateChanged(auth, (user) => {
    if (requireAuth && !user) {
      window.location.href = redirectTo;
    }

    if (!requireAuth && user) {
      window.location.href = "/dashboard/";
    }
  });
}
