import { db } from "./firebase-config.js";
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const SENHA = "admin123"; // 🔒 Troque para uma senha sua

const btnLogin = document.getElementById("btn-login");
const erroLogin = document.getElementById("erro-login");
const painel = document.getElementById("painel");
const loginBox = document.getElementById("login-box");
const filtroTipo = document.getElementById("filtro-tipo");
const listaRelatos = document.getElementById("lista-relatos");

let todosRelatos = [];

btnLogin.addEventListener("click", () => {
  const senha = document.getElementById("senha-admin").value;
  if (senha === SENHA) {
    loginBox.style.display = "none";
    painel.style.display = "block";
    carregarRelatos();
  } else {
    erroLogin.textContent = "❌ Senha incorreta.";
  }
});

filtroTipo.addEventListener("change", () => renderRelatos());

async function carregarRelatos() {
  listaRelatos.innerHTML = "<p>Carregando...</p>";
  const q = query(collection(db, "relatos"), orderBy("criadoEm", "desc"));
  const snap = await getDocs(q);
  todosRelatos = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderRelatos();
}

const emojis = { Elogio: "😊", Sugestão: "💡", Reclamação: "😠", Denúncia: "🚨" };

function renderRelatos() {
  const filtro = filtroTipo.value;
  const lista = filtro ? todosRelatos.filter(r => r.tipo === filtro) : todosRelatos;

  if (lista.length === 0) {
    listaRelatos.innerHTML = "<p>Nenhum relato encontrado.</p>";
    return;
  }

  listaRelatos.innerHTML = lista.map(r => `
    <div class="card-relato tipo-${r.tipo.toLowerCase().replace('ã','a').replace('ú','u')}">
      <div class="card-header">
        <span class="badge">${emojis[r.tipo] || "📝"} ${r.tipo}</span>
        <span class="card-data">${r.criadoEm?.toDate().toLocaleString("pt-BR") || ""}</span>
      </div>
      <p><strong>📍 Local:</strong> ${r.local}</p>
      ${r.data ? `<p><strong>📅 Data aproximada:</strong> ${r.data}</p>` : ""}
      <p><strong>📝 Descrição:</strong> ${r.descricao}</p>
      ${r.nome ? `<p><strong>👤 Nome:</strong> ${r.nome}</p>` : ""}
      ${r.contato ? `<p><strong>📞 Contato:</strong> ${r.contato}</p>` : ""}
      ${r.curso ? `<p><strong>🎓 Curso:</strong> ${r.curso}</p>` : ""}
      ${r.turma ? `<p><strong>🏫 Turma:</strong> ${r.turma}</p>` : ""}
      ${r.imagem ? `<img src="${r.imagem}" alt="Imagem do relato" class="img-relato"/>` : ""}
    </div>
  `).join("");
}
