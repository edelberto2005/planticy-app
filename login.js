// JavaScript para index.html (página de login)

let usuarioAtual = null

// Inicialização para página de login
document.addEventListener("DOMContentLoaded", () => {
  // Verificar se há usuário logado
  const usuarioSalvo = localStorage.getItem("usuario")
  if (usuarioSalvo) {
    // Se já está logado, redirecionar para dashboard
    window.location.href = "dashboard.html"
  }

  // Event listener para o formulário de login
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }
})

// Login
function handleLogin(e) {
  e.preventDefault()

  const nome = document.getElementById("nome").value.trim()
  const tipo = document.querySelector('input[name="tipo"]:checked').value

  if (!nome) {
    alert("Por favor, digite seu nome")
    return
  }

  usuarioAtual = { nome, tipo }
  localStorage.setItem("usuario", JSON.stringify(usuarioAtual))

  // Redirecionar para dashboard
  window.location.href = "dashboard.html"
}