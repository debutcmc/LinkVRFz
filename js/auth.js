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

export async function login(email, password) {
  await signInWithEmailAndPassword(auth, email, password);

  const redirect = sessionStorage.getItem("linkvrfz:redirect");
  sessionStorage.removeItem("linkvrfz:redirect");
  location.href = redirect || "/dashboard/";
}

export async function register(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    role: "user",
    premium: false,

    coin: 300,
    tokenQuota: 15,
    totalLink: 0,

    createdAt: Date.now()
  });

  location.href = "/dashboard/";
}

export async function logout() {
  await signOut(auth);
  location.href = "/login/";
}
