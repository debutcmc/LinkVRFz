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
    return Promise.reject("Email & password wajib diisi");
  }

  return signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "/dashboard/";
    });
}

/* ========================= */
/* REGISTER */
/* ========================= */
export function register(email, password) {
  if (!email || !password) {
    return Promise.reject("Email & password wajib diisi");
  }

  if (password.length < 6) {
    return Promise.reject("Password minimal 6 karakter");
  }

  return createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "/dashboard/";
    });
}

/* ========================= */
/* LOGOUT */
/* ========================= */
export function logout() {
  return signOut(auth).then(() => {
    window.location.href = "/login/";
  });
}

/* ========================= */
/* AUTH GUARD */
/* ========================= */
/**
 * @param {boolean} isAuthPage
 * true  → halaman login
 * false → halaman protected (dashboard, create, go)
 */
export function initAuthGuard(isAuthPage = false) {
  onAuthStateChanged(auth, (user) => {
    if (isAuthPage && user) {
      // sudah login tapi buka login page
      window.location.href = "/dashboard/";
    }

    if (!isAuthPage && !user) {
      // belum login tapi buka page protected
      window.location.href = "/login/";
    }
  });
}
