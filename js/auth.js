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
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =========================
   AUTH STATE LISTENER
========================= */
export function initAuthGuard(redirectIfLogged = false) {
  onAuthStateChanged(auth, (user) => {
    const path = window.location.pathname;

    if (!user && path !== "/login/") {
      window.location.href = "/login/";
    }

    if (user && redirectIfLogged) {
      window.location.href = "/dashboard/";
    }
  });
}

/* =========================
   REGISTER
========================= */
export async function register(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", cred.user.uid), {
    email,
    coins: 0,
    createdAt: serverTimestamp(),
    plan: "free",
    freeTrialLeft: 5
  });

  window.location.href = "/dashboard/";
}

/* =========================
   LOGIN
========================= */
export async function login(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
  window.location.href = "/dashboard/";
}

/* =========================
   LOGOUT
========================= */
export function logout() {
  signOut(auth).then(() => {
    window.location.href = "/login/";
  });
}

/* =========================
   GET CURRENT USER DATA
========================= */
export async function getCurrentUserData() {
  const user = auth.currentUser;
  if (!user) return null;

  const snap = await getDoc(doc(db, "users", user.uid));
  return snap.exists() ? snap.data() : null;
}

