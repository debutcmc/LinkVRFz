// /js/auth.js
import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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

  listeners.forEach(cb => cb(user));
});

/* =============================
   PUBLIC API
   ============================= */

export function waitAuthReady() {
  return new Promise((resolve) => {
    if (authReady) resolve(currentUser);
    else listeners.push(resolve);
  });
}

export function getCurrentUser() {
  return currentUser;
}

export function isLoggedIn() {
  return !!currentUser;
}

/* =============================
   LOGIN
   ============================= */

export async function login(email, password) {
  if (!email || !password) {
    throw new Error("Email dan password wajib diisi");
  }

  await signInWithEmailAndPassword(auth, email, password);

  // redirect setelah login
  const redirect = sessionStorage.getItem("linkvrfz:redirect");
  sessionStorage.removeItem("linkvrfz:redirect");

  location.href = redirect || "/dashboard/";
}

/* =============================
   REGISTER
   ============================= */

export async function register(email, password) {
  if (!email || !password) {
    throw new Error("Email dan password wajib diisi");
  }

  if (password.length < 6) {
    throw new Error("Password minimal 6 karakter");
  }

  await createUserWithEmailAndPassword(auth, email, password);

  location.href = "/dashboard/";
}

/* =============================
   LOGOUT
   ============================= */

export async function logout() {
  await signOut(auth);
  location.href = "/login/";
}

/* =============================
   AUTH GUARD
   ============================= */

/**
 * @param {boolean} blockWhenLoggedIn
 * true  -> user login TIDAK BOLEH masuk (login page)
 * false -> user BELUM login TIDAK BOLEH masuk (create, dashboard)
 */
export function initAuthGuard(blockWhenLoggedIn = false) {
  waitAuthReady().then(user => {
    if (blockWhenLoggedIn && user) {
      location.href = "/dashboard/";
    }

    if (!blockWhenLoggedIn && !user) {
      sessionStorage.setItem(
        "linkvrfz:redirect",
        location.pathname
      );
      location.href = "/login/";
    }
  });
}
