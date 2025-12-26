import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const authBlock = document.getElementById("authBlock");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    authBlock.classList.remove("hidden");
  }
});
