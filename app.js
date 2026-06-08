import { db } from "./firebase-config.js";
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form = document.querySelector("form");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const tipo = document.getElementById("tipo").value;
  const data = document.getElementById("data").value;
  const local = document.getElementById("local").value;
  const descricao = document.getElementById("descricao").value;

  mensagem.textContent = "Enviando...";
  mensagem.style.color = "gray";

  try {
    await addDoc(collection(db, "relatos"), {
      tipo,
      data,
      local,
      descricao,
      criadoEm: Timestamp.now()
    });

    mensagem.textContent = "✅ Relato enviado com sucesso!";
    mensagem.style.color = "green";
    form.reset();

  } catch (erro) {
    mensagem.textContent = "❌ Erro ao enviar: " + erro.message;
    mensagem.style.color = "red";
    console.error(erro);
  }
});
