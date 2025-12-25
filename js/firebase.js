import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyApMS43CuKGTA2w6lLz5Mm-61L1PcEwpOk",
  authDomain: "linkvrfz-35ebf.firebaseapp.com",
  projectId: "linkvrfz-35ebf",
  storageBucket: "linkvrfz-35ebf.firebasestorage.app",
  messagingSenderId: "991526630066",
  appId: "1:991526630066:web:a91b2b8aa591578cad4fab",
  measurementId: "G-0QRF0P7BCR"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

