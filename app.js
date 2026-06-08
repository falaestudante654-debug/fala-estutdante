import { db } from "./firebase-config.js";
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form = document.getElementById("form-relato");
const mensagem = document.getElementById("mensagem");
const btnEnviar = document.getElementById("btn-enviar");
const tipoBtns = document.querySelectorAll(".tipo-btn");
const tipoInput = document.getElementById("tipo");

// Seleção de tipo por card
tipoBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    tipoBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    tipoInput.value = btn.dataset.value;
  });
});

// Converte imagem para base64
function lerImagemBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    if (file.size > 2 * 1024 * 1024) return reject("Imagem muito grande. Máx. 2MB.");
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject("Erro ao ler imagem.");
    reader.readAsDataURL(file);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const imagemFile = document.getElementById("imagem").files[0];

  btnEnviar.disabled = true;
  btnEnviar.textContent = "Enviando...";
  mensagem.textContent = "";

  try {
    const imagemBase64 = await lerImagemBase64(imagemFile);

    await addDoc(collection(db, "relatos"), {
      tipo: tipoInput.value,
      data: document.getElementById("data").value || null,
      local: document.getElementById("local").value,
      descricao: document.getElementById("descricao").value,
      nome: document.getElementById("nome").value || null,
      contato: document.getElementById("contato").value || null,
      curso: document.getElementById("curso").value || null,
      turma: document.getElementById("turma").value || null,
      imagem: imagemBase64,
      criadoEm: Timestamp.now()
    });

    mensagem.textContent = "✅ Relato enviado com sucesso! Obrigado pela sua contribuição.";
    mensagem.className = "sucesso";
    form.reset();
    tipoBtns.forEach(b => b.classList.remove("active"));
    tipoBtns[0].classList.add("active");
    tipoInput.value = "Elogio";

  } catch (erro) {
    mensagem.textContent = "❌ Erro ao enviar: " + (typeof erro === "string" ? erro : erro.message);
    mensagem.className = "erro";
    console.error(erro);
  } finally {
    btnEnviar.disabled = false;
    btnEnviar.textContent = "Enviar Relato";
  }
});
