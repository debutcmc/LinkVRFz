import { auth } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const authBlock = document.getElementById("authBlock");
const createForm = document.getElementById("createForm");

if (authBlock) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // USER BELUM LOGIN
      authBlock.classList.remove("hidden");

      if (createForm) {
        createForm.classList.add("disabled");
      }
    } else {
      // USER LOGIN
      authBlock.classList.add("hidden");

      if (createForm) {
        createForm.classList.remove("disabled");
      }
    }
  });
}
