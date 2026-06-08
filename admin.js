import { db } from "./firebase-config.js";
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔒 Único e-mail autorizado
const EMAIL_ADMIN = "falaestudante654@gmail.com";

const auth = getAuth();
const provider = new GoogleAuthProvider();

const loginBox = document.getElementById("login-box");
const painel = document.getElementById("painel");
const erroLogin = document.getElementById("erro-login");
const btnGoogle = document.getElementById("btn-google");
const btnSair = document.getElementById("btn-sair");
const usuarioLogado = document.getElementById("usuario-logado");
const filtroTipo = document.getElementById("filtro-tipo");
const listaRelatos = document.getElementById("lista-relatos");

let todosRelatos = [];

// Login com Google
btnGoogle.addEventListener("click", async () => {
  try {
    const resultado = await signInWithPopup(auth, provider);
    const email = resultado.user.email;
    if (email !== EMAIL_ADMIN) {
      await signOut(auth);
      erroLogin.textContent = "❌ Acesso negado. Este e-mail não é autorizado.";
    }
  } catch (erro) {
    erroLogin.textContent = "❌ Erro ao fazer login: " + erro.message;
  }
});

// Sair
btnSair.addEventListener("click", () => signOut(auth));

// Observa estado do login
onAuthStateChanged(auth, (user) => {
  if (user && user.email === EMAIL_ADMIN) {
    loginBox.style.display = "none";
    painel.style.display = "block";
    usuarioLogado.textContent = "👤 " + user.email;
    carregarRelatos();
  } else {
    loginBox.style.display = "block";
    painel.style.display = "none";
  }
});

filtroTipo.addEventListener("change", renderRelatos);

async function carregarRelatos() {
  listaRelatos.innerHTML = "<p>Carregando relatos...</p>";
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
    <div class="card-relato tipo-${r.tipo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}">
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
