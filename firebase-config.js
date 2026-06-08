import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCKpxwqS8RTAh3C5Z4caUw2cxpUu8EK3HE",
  authDomain: "fala-estudante.firebaseapp.com",
  projectId: "fala-estudante",
  storageBucket: "fala-estudante.firebasestorage.app",
  messagingSenderId: "1066764400190",
  appId: "1:1066764400190:web:914dc1696a497f939bc36f",
  measurementId: "G-LFFX57YH6Z"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
