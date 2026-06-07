import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const form = document.getElementById("relatoForm");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await addDoc(collection(db, "relatos"), {
    tipo: document.getElementById("tipo").value,
    data: document.getElementById("data").value,
    local: document.getElementById("local").value,
    descricao: document.getElementById("descricao").value,
    criadoEm: serverTimestamp()
  });

  mensagem.textContent = "✅ Relato enviado com sucesso!";
  form.reset();
});
