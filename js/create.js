// /js/create.js
import { db, auth } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/login/";
  } else {
    currentUser = user;
  }
});

window.generateLink = async function () {
  const title = document.getElementById("name").value.trim();
  const target = document.getElementById("to").value.trim();
  const mode = document.getElementById("mode").value;

  if (!title || !target) {
    alert("Judul dan link wajib diisi");
    return;
  }

  try {
    new URL(target);
  } catch {
    alert("URL tidak valid");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "links"), {
      title,
      targetUrl: target,
      mode,
      ownerUid: currentUser.uid,
      createdAt: serverTimestamp(),
      expireAt: null,
      clicks: 0,
      active: true
    });

    const finalLink =
      `${location.origin}/go/?id=${docRef.id}`;

    document.getElementById("mainResult").innerHTML = `
      <strong>Link berhasil dibuat</strong><br><br>
      <input value="${finalLink}" onclick="this.select()" style="width:100%;padding:10px">
      <small>Klik untuk copy</small>
    `;
  } catch (err) {
    alert("Gagal membuat link");
    console.error(err);
  }
};
