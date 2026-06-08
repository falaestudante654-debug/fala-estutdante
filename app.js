import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const form = document.getElementById("relatoForm");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  mensagem.textContent = "⏳ Enviando...";
  mensagem.style.color = "gray";

  try {
    await addDoc(collection(db, "relatos"), {
      tipo: document.getElementById("tipo").value,
      data: document.getElementById("data").value,
      local: document.getElementById("local").value,
      descricao: document.getElementById("descricao").value,
      criadoEm: serverTimestamp()
    });

    mensagem.textContent = "✅ Relato enviado com sucesso!";
    mensagem.style.color = "green";
    form.reset();

  } catch (erro) {
    console.error("Erro ao enviar:", erro);
    mensagem.textContent = "❌ Erro ao enviar: " + erro.message;
    mensagem.style.color = "red";
  }
});
