// /js/auth.js
import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

/* =============================
   GLOBAL AUTH STATE
   ============================= */

let currentUser = null;
let authReady = false;
const listeners = [];

/* =============================
   AUTH OBSERVER
   ============================= */

onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  authReady = true;

  // pastikan user doc ada
  if (user) {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        email: user.email,
        role: "user",
        premium: false,
        createdAt: Date.now()
      });
    }
  }

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

  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    role: "user",
    premium: false,
    createdAt: Date.now()
  });

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
