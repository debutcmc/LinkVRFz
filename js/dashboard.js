import { initAuthGuard, logout } from "./auth.js";

/* ============================= */
/* GUARD → WAJIB LOGIN */
/* ============================= */
initAuthGuard(true);

/* ============================= */
/* LOGOUT BUTTON */
/* ============================= */
document.getElementById("logoutBtn").onclick = () => {
  logout()
    .then(() => {
      window.location.href = "/login/";
    })
    .catch(alert);
};

