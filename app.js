const form = document.getElementById("relatoForm");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    mensagem.innerHTML = "✅ Relato enviado com sucesso!";

    form.reset();
});
