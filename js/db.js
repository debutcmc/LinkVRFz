// /js/db.js
import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ========================= */
/* USER INIT */
/* ========================= */
export async function initUser(uid, email) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      email,
      coins: 0,
      plan: "free",
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
  } else {
    await updateDoc(ref, {
      lastLogin: serverTimestamp()
    });
  }
}

/* ========================= */
/* CREATE LINK */
/* ========================= */
export async function createLink(uid, data) {
  return addDoc(collection(db, "links"), {
    uid,
    title: data.title,
    targetUrl: data.targetUrl,
    fileHash: data.fileHash,
    visits: 0,
    isActive: true,
    createdAt: serverTimestamp(),
    expiresAt: data.expiresAt
  });
}

/* ========================= */
/* VISIT COUNT */
/* ========================= */
export async function increaseVisit(linkId) {
  const ref = doc(db, "links", linkId);
  await updateDoc(ref, {
    visits: increment(1)
  });
}
