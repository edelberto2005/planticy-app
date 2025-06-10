// Dados simulados
const problemas = [
  {
    id: 1,
    titulo: "Buraco na Avenida Brasil",
    descricao: "Buraco grande na Avenida Brasil causando transtornos no trânsito",
    categoria: "infraestrutura",
    status: "pendente",
    votos: 15,
    autor: "Maria Silva",
    data: "2024-01-15",
    bairro: "Centro",
    prioridade: "alta",
    estimativa: "R$ 5.000",
    prazoEstimado: "15 dias",
  },
  {
    id: 2,
    titulo: "Falta de Iluminação na Zona 7",
    descricao: "Postes sem iluminação adequada na região da Zona 7",
    categoria: "iluminacao",
    status: "em_analise",
    votos: 23,
    autor: "João Santos",
    data: "2024-01-10",
    bairro: "Zona 7",
    prioridade: "media",
    estimativa: "R$ 8.000",
    prazoEstimado: "20 dias",
  },
  {
    id: 3,
    titulo: "Sugestão de Praça no Jardim Alvorada",
    descricao: "Área abandonada no Jardim Alvorada que poderia virar uma praça",
    categoria: "mobilidade",
    status: "aprovado",
    votos: 45,
    autor: "Ana Costa",
    data: "2024-01-05",
    bairro: "Jardim Alvorada",
    prioridade: "baixa",
    estimativa: "R$ 25.000",
    prazoEstimado: "60 dias",
  },
  {
    id: 4,
    titulo: "Semáforo com Defeito na Av. Colombo",
    descricao: "Semáforo intermitente na Avenida Colombo com Rua Néo Alves Martins",
    categoria: "infraestrutura",
    status: "pendente",
    votos: 56,
    autor: "Paulo Mendes",
    data: "2024-01-20",
    bairro: "Centro",
    prioridade: "urgente",
    estimativa: "R$ 3.000",
    prazoEstimado: "7 dias",
  },
]

const projetos = [
  {
    id: 1,
    titulo: "Reparo da Avenida Brasil",
    descricao: "Correção de buracos e recapeamento da Avenida Brasil",
    solicitadoPor: "Prefeitura de Maringá",
    votos: 45,
    prioridade: "urgente",
    prazo: "15/11/2023",
    orcamento: 15000,
    status: "atribuido",
    progresso: 25,
    especialista: "João Silva",
    dataInicio: "2024-01-10",
    timeline: [
      { data: "2024-01-10", titulo: "Projeto Iniciado", descricao: "Análise inicial do local" },
      { data: "2024-01-12", titulo: "Orçamento Aprovado", descricao: "Orçamento de R$ 15.000 aprovado" },
      { data: "2024-01-15", titulo: "Materiais Solicitados", descricao: "Pedido de materiais enviado" },
    ],
  },
  {
    id: 2,
    titulo: "Reparo de Semáforo na Av. Colombo",
    descricao: "Conserto do semáforo na Avenida Colombo com Rua Néo Alves Martins",
    solicitadoPor: "Prefeitura de Maringá",
    votos: 56,
    prioridade: "alta",
    prazo: "30/11/2023",
    orcamento: 25000,
    status: "em_progresso",
    progresso: 60,
    especialista: "Maria Santos",
    dataInicio: "2024-01-05",
    timeline: [
      { data: "2024-01-05", titulo: "Projeto Iniciado", descricao: "Diagnóstico do problema" },
      { data: "2024-01-08", titulo: "Peças Encomendadas", descricao: "Componentes eletrônicos solicitados" },
      { data: "2024-01-12", titulo: "Instalação Iniciada", descricao: "Início dos trabalhos de instalação" },
    ],
  },
]

const orcamentos = []
const feedbacks = []

let usuarioAtual = null

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Verificar se há usuário logado
  const usuarioSalvo = localStorage.getItem("usuario")
  if (usuarioSalvo) {
    usuarioAtual = JSON.parse(usuarioSalvo)
    showDashboard(usuarioAtual.tipo)
  } else {
    showPage("home-page")
  }

  // Event listeners
  document.getElementById("login-form").addEventListener("submit", handleLogin)
  document.getElementById("report-form").addEventListener("submit", handleReportSubmit)
  document.getElementById("budget-form").addEventListener("submit", handleBudgetSubmit)
  document.getElementById("feedback-form").addEventListener("submit", handleFeedbackSubmit)
  document.getElementById("filter-category").addEventListener("change", filterProblems)

  // Event listeners para cálculo de orçamento
  const budgetInputs = ["budget-materials", "budget-labor", "budget-equipment"]
  budgetInputs.forEach((id) => {
    const input = document.getElementById(id)
    if (input) {
      input.addEventListener("input", calculateBudgetTotal)
    }
  })

  // Event listeners para rating
  setupRatingStars()

  // Carregar dados iniciais
  loadProblems()
  loadGestorProblems()
  loadEspecialistaProjetos()
  loadBudgetProjects()
})

// Navegação entre páginas
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active")
  })
  document.getElementById(pageId).classList.add("active")
}

function showDashboard(tipo) {
  showPage(`dashboard-${tipo}`)
  updateStats()
}

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

  showDashboard(tipo)
}

// Logout
function logout() {
  localStorage.removeItem("usuario")
  usuarioAtual = null
  showPage("home-page")
  document.getElementById("login-form").reset()
}

// Modal de reportar problema
function showReportModal() {
  document.getElementById("report-modal").classList.add("active")
}

function closeReportModal() {
  document.getElementById("report-modal").classList.remove("active")
  document.getElementById("report-form").reset()
}

// Submeter novo problema
function handleReportSubmit(e) {
  e.preventDefault()

  const titulo = document.getElementById("problem-title").value
  const categoria = document.getElementById("problem-category").value
  const bairro = document.getElementById("problem-neighborhood").value || "Não informado"
  const descricao = document.getElementById("problem-description").value

  const novoProblema = {
    id: Date.now(),
    titulo,
    descricao,
    categoria,
    bairro,
    status: "pendente",
    votos: 1,
    autor: usuarioAtual?.nome || "Usuário",
    data: new Date().toISOString().split("T")[0],
    prioridade: "media",
    estimativa: "A definir",
    prazoEstimado: "A definir",
  }

  problemas.unshift(novoProblema)
  loadProblems()
  loadGestorProblems()
  updateStats()
  closeReportModal()

  alert("Problema reportado com sucesso!")
}

// Modal de detalhes
function showDetailsModal(id, tipo = "problema") {
  const modal = document.getElementById("details-modal")
  const titleElement = document.getElementById("details-title")
  const contentElement = document.getElementById("details-content")

  let item
  if (tipo === "problema") {
    item = problemas.find((p) => p.id === id)
    titleElement.textContent = "Detalhes do Problema"
  } else {
    item = projetos.find((p) => p.id === id)
    titleElement.textContent = "Detalhes do Projeto"
  }

  if (!item) return

  let content = `
    <div class="details-grid">
      <div>
        <div class="detail-item">
          <div class="detail-label">Título</div>
          <div class="detail-value">${item.titulo}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Descrição</div>
          <div class="detail-value">${item.descricao}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Status</div>
          <div class="detail-value">
            <span class="status-badge status-${item.status}">${getStatusText(item.status)}</span>
          </div>
        </div>
        ${
          item.categoria
            ? `
        <div class="detail-item">
          <div class="detail-label">Categoria</div>
          <div class="detail-value">${getCategoryText(item.categoria)}</div>
        </div>
        `
            : ""
        }
      </div>
      <div>
        <div class="detail-item">
          <div class="detail-label">${tipo === "problema" ? "Autor" : "Solicitado por"}</div>
          <div class="detail-value">${item.autor || item.solicitadoPor}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Data</div>
          <div class="detail-value">${formatDate(item.data || item.dataInicio)}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Apoios/Votos</div>
          <div class="detail-value">${item.votos}</div>
        </div>
        ${
          item.bairro
            ? `
        <div class="detail-item">
          <div class="detail-label">Bairro</div>
          <div class="detail-value">${item.bairro}</div>
        </div>
        `
            : ""
        }
        ${
          item.prioridade
            ? `
        <div class="detail-item">
          <div class="detail-label">Prioridade</div>
          <div class="detail-value">
            <span class="status-badge status-${item.prioridade}">${item.prioridade.charAt(0).toUpperCase() + item.prioridade.slice(1)}</span>
          </div>
        </div>
        `
            : ""
        }
      </div>
    </div>
  `

  if (tipo === "projeto") {
    content += `
      <div class="detail-item">
        <div class="detail-label">Progresso</div>
        <div class="detail-value">
          ${item.progresso}%
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${item.progresso}%"></div>
          </div>
        </div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Orçamento</div>
        <div class="detail-value">R$ ${item.orcamento.toLocaleString()}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Especialista Responsável</div>
        <div class="detail-value">${item.especialista}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Prazo</div>
        <div class="detail-value">${item.prazo}</div>
      </div>
    `

    if (item.timeline && item.timeline.length > 0) {
      content += `
        <div class="detail-item">
          <div class="detail-label">Timeline do Projeto</div>
          <div class="timeline">
            ${item.timeline
              .map(
                (t) => `
              <div class="timeline-item">
                <div class="timeline-date">${formatDate(t.data)}</div>
                <div class="timeline-title">${t.titulo}</div>
                <div class="timeline-description">${t.descricao}</div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      `
    }
  }

  contentElement.innerHTML = content
  modal.classList.add("active")
}

function closeDetailsModal() {
  document.getElementById("details-modal").classList.remove("active")
}

// Modal de orçamento
function showBudgetModal(projectId = null) {
  const modal = document.getElementById("budget-modal")
  loadBudgetProjects()

  if (projectId) {
    document.getElementById("budget-project").value = projectId
  }

  modal.classList.add("active")
}

function closeBudgetModal() {
  document.getElementById("budget-modal").classList.remove("active")
  document.getElementById("budget-form").reset()
  document.getElementById("budget-total-value").textContent = "0.00"
}

function loadBudgetProjects() {
  const select = document.getElementById("budget-project")
  if (!select) return

  select.innerHTML = '<option value="">Selecione um projeto</option>'

  projetos.forEach((projeto) => {
    const option = document.createElement("option")
    option.value = projeto.id
    option.textContent = projeto.titulo
    select.appendChild(option)
  })
}

function calculateBudgetTotal() {
  const materials = Number.parseFloat(document.getElementById("budget-materials").value) || 0
  const labor = Number.parseFloat(document.getElementById("budget-labor").value) || 0
  const equipment = Number.parseFloat(document.getElementById("budget-equipment").value) || 0

  const total = materials + labor + equipment
  document.getElementById("budget-total-value").textContent = total.toFixed(2)
}

function handleBudgetSubmit(e) {
  e.preventDefault()

  const projectId = document.getElementById("budget-project").value
  const description = document.getElementById("budget-description").value
  const materials = Number.parseFloat(document.getElementById("budget-materials").value) || 0
  const labor = Number.parseFloat(document.getElementById("budget-labor").value) || 0
  const equipment = Number.parseFloat(document.getElementById("budget-equipment").value) || 0
  const deadline = document.getElementById("budget-deadline").value

  const total = materials + labor + equipment

  const novoOrcamento = {
    id: Date.now(),
    projectId: Number.parseInt(projectId),
    description,
    materials,
    labor,
    equipment,
    total,
    deadline,
    autor: usuarioAtual?.nome || "Especialista",
    data: new Date().toISOString().split("T")[0],
    status: "pendente",
  }

  orcamentos.push(novoOrcamento)
  closeBudgetModal()

  alert("Orçamento enviado com sucesso!")
}

// Modal de feedback
function showFeedbackModal() {
  document.getElementById("feedback-modal").classList.add("active")
}

function closeFeedbackModal() {
  document.getElementById("feedback-modal").classList.remove("active")
  document.getElementById("feedback-form").reset()
  resetRatingStars()
}

function setupRatingStars() {
  const stars = document.querySelectorAll(".star")
  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      const rating = index + 1
      document.getElementById("feedback-rating").value = rating
      updateStarDisplay(rating)
    })

    star.addEventListener("mouseover", () => {
      updateStarDisplay(index + 1)
    })
  })

  const container = document.querySelector(".rating-stars")
  if (container) {
    container.addEventListener("mouseleave", () => {
      const currentRating = document.getElementById("feedback-rating").value
      updateStarDisplay(currentRating)
    })
  }
}

function updateStarDisplay(rating) {
  const stars = document.querySelectorAll(".star")
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add("active")
    } else {
      star.classList.remove("active")
    }
  })
}

function resetRatingStars() {
  document.getElementById("feedback-rating").value = 0
  updateStarDisplay(0)
}

function handleFeedbackSubmit(e) {
  e.preventDefault()

  const type = document.getElementById("feedback-type").value
  const rating = document.getElementById("feedback-rating").value
  const message = document.getElementById("feedback-message").value

  const novoFeedback = {
    id: Date.now(),
    type,
    rating: Number.parseInt(rating),
    message,
    autor: usuarioAtual?.nome || "Usuário",
    data: new Date().toISOString().split("T")[0],
  }

  feedbacks.push(novoFeedback)
  closeFeedbackModal()

  alert("Feedback enviado com sucesso! Obrigado pela sua contribuição.")
}

// Carregar problemas
function loadProblems() {
  const container = document.getElementById("problems-list")
  if (!container) return

  const filtro = document.getElementById("filter-category")?.value || "todos"
  const problemasFiltrados = filtro === "todos" ? problemas : problemas.filter((p) => p.categoria === filtro)

  container.innerHTML = problemasFiltrados
    .map(
      (problema) => `
        <div class="problem-card">
            <div class="problem-header">
                <div>
                    <div class="problem-title">${problema.titulo}</div>
                    <span class="status-badge status-${problema.status}">${getStatusText(problema.status)}</span>
                </div>
                <div class="problem-actions">
                    <button class="btn btn-secondary" onclick="votarProblema(${problema.id})">
                        <i class="fas fa-thumbs-up"></i> ${problema.votos}
                    </button>
                    <button class="btn btn-primary" onclick="showDetailsModal(${problema.id}, 'problema')">
                        <i class="fas fa-eye"></i> Ver Detalhes
                    </button>
                    <button class="btn btn-purple" onclick="showFeedbackModal()">
                        <i class="fas fa-comment"></i> Feedback
                    </button>
                </div>
            </div>
            <div class="problem-description">${problema.descricao}</div>
            <div class="problem-meta">
                <span><i class="fas fa-map-marker-alt"></i> ${problema.bairro}</span>
                <span><i class="fas fa-user"></i> ${problema.autor}</span>
                <span><i class="fas fa-calendar"></i> ${formatDate(problema.data)}</span>
                <span><i class="fas fa-tag"></i> ${getCategoryText(problema.categoria)}</span>
            </div>
        </div>
    `,
    )
    .join("")
}

// Carregar problemas para gestor
function loadGestorProblems() {
  const container = document.getElementById("gestor-problems-list")
  if (!container) return

  const problemasPendentes = problemas.filter((p) => p.status === "pendente" || p.status === "em_analise")

  container.innerHTML = problemasPendentes
    .map(
      (problema) => `
        <div class="problem-card">
            <div class="problem-header">
                <div>
                    <div class="problem-title">${problema.titulo}</div>
                    <span class="status-badge status-${problema.status}">${getStatusText(problema.status)}</span>
                </div>
                <div class="problem-actions">
                    <button class="btn btn-secondary" onclick="votarProblema(${problema.id})">
                        <i class="fas fa-thumbs-up"></i> ${problema.votos}
                    </button>
                    <button class="btn btn-primary" onclick="showDetailsModal(${problema.id}, 'problema')">
                        <i class="fas fa-eye"></i> Ver Detalhes
                    </button>
                    ${
                      problema.status === "pendente"
                        ? `
                        <button class="btn btn-warning" onclick="alterarStatus(${problema.id}, 'em_analise')">
                            <i class="fas fa-search"></i> Analisar
                        </button>
                        <button class="btn btn-success" onclick="alterarStatus(${problema.id}, 'aprovado')">
                            <i class="fas fa-check"></i> Aprovar
                        </button>
                    `
                        : ""
                    }
                    ${
                      problema.status === "em_analise"
                        ? `
                        <button class="btn btn-success" onclick="alterarStatus(${problema.id}, 'aprovado')">
                            <i class="fas fa-check"></i> Aprovar
                        </button>
                        <button class="btn btn-secondary" onclick="alterarStatus(${problema.id}, 'rejeitado')">
                            <i class="fas fa-times"></i> Rejeitar
                        </button>
                    `
                        : ""
                    }
                    ${
                      problema.status === "aprovado"
                        ? `
                        <button class="btn btn-success" onclick="alterarStatus(${problema.id}, 'concluido')">
                            <i class="fas fa-check-circle"></i> Concluir
                        </button>
                    `
                        : ""
                    }
                </div>
            </div>
            <div class="problem-description">${problema.descricao}</div>
            <div class="problem-meta">
                <span><i class="fas fa-map-marker-alt"></i> ${problema.bairro}</span>
                <span><i class="fas fa-user"></i> ${problema.autor}</span>
                <span><i class="fas fa-calendar"></i> ${formatDate(problema.data)}</span>
                <span><i class="fas fa-tag"></i> ${getCategoryText(problema.categoria)}</span>
                <span><i class="fas fa-exclamation-triangle"></i> ${problema.prioridade}</span>
            </div>
        </div>
    `,
    )
    .join("")
}

// Carregar projetos para especialista
function loadEspecialistaProjetos() {
  const container = document.getElementById("especialista-projects-list")
  if (!container) return

  container.innerHTML = projetos
    .map(
      (projeto) => `
        <div class="problem-card">
            <div class="problem-header">
                <div>
                    <div class="problem-title">${projeto.titulo}</div>
                    <span class="status-badge status-${projeto.status}">${getProjectStatusText(projeto.status)}</span>
                </div>
                <div class="problem-actions">
                    <button class="btn btn-primary" onclick="showDetailsModal(${projeto.id}, 'projeto')">
                        <i class="fas fa-eye"></i> Ver Detalhes
                    </button>
                    <button class="btn btn-purple" onclick="showBudgetModal(${projeto.id})">
                        <i class="fas fa-dollar-sign"></i> Orçamento
                    </button>
                    <button class="btn btn-secondary" onclick="showFeedbackModal()">
                        <i class="fas fa-comment"></i> Feedback
                    </button>
                </div>
            </div>
            <div class="problem-description">${projeto.descricao}</div>
            <div class="problem-meta">
                <span><i class="fas fa-building"></i> ${projeto.solicitadoPor}</span>
                <span><i class="fas fa-users"></i> ${projeto.votos} apoios</span>
                <span><i class="fas fa-calendar"></i> ${projeto.prazo}</span>
                <span><i class="fas fa-dollar-sign"></i> R$ ${projeto.orcamento.toLocaleString()}</span>
                <span><i class="fas fa-user-tie"></i> ${projeto.especialista}</span>
            </div>
            <div class="detail-item" style="margin-top: 1rem;">
                <div class="detail-label">Progresso: ${projeto.progresso}%</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${projeto.progresso}%"></div>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Votar em problema
function votarProblema(id) {
  const problema = problemas.find((p) => p.id === id)
  if (problema) {
    problema.votos++
    loadProblems()
    loadGestorProblems()
    updateStats()

    // Feedback visual
    const button = event.target.closest("button")
    if (button) {
      button.style.transform = "scale(1.1)"
      setTimeout(() => {
        button.style.transform = "scale(1)"
      }, 200)
    }
  }
}

// Alterar status do problema
function alterarStatus(id, novoStatus) {
  const problema = problemas.find((p) => p.id === id)
  if (problema) {
    problema.status = novoStatus

    // Se aprovado, criar projeto correspondente
    if (novoStatus === "aprovado") {
      const novoProjeto = {
        id: Date.now(),
        titulo: `Solução: ${problema.titulo}`,
        descricao: problema.descricao,
        solicitadoPor: "Prefeitura de Maringá",
        votos: problema.votos,
        prioridade: problema.prioridade || "media",
        prazo: "A definir",
        orcamento: 0,
        status: "atribuido",
        progresso: 0,
        especialista: "A definir",
        dataInicio: new Date().toISOString().split("T")[0],
        timeline: [
          {
            data: new Date().toISOString().split("T")[0],
            titulo: "Projeto Criado",
            descricao: "Projeto criado a partir da demanda aprovada",
          },
        ],
      }
      projetos.push(novoProjeto)
      loadEspecialistaProjetos()
    }

    loadProblems()
    loadGestorProblems()
    updateStats()

    alert(`Status alterado para: ${getStatusText(novoStatus)}`)
  }
}

// Filtrar problemas
function filterProblems() {
  loadProblems()
}

// Atualizar estatísticas
function updateStats() {
  // Estatísticas do cidadão
  const minhasContribuicoes = document.getElementById("minhas-contribuicoes")
  if (minhasContribuicoes) {
    minhasContribuicoes.textContent = problemas.filter((p) => p.autor === usuarioAtual?.nome).length
  }

  const problemasResolvidos = document.getElementById("problemas-resolvidos")
  if (problemasResolvidos) {
    problemasResolvidos.textContent = problemas.filter((p) => p.status === "concluido").length
  }

  const sugestoesAprovadas = document.getElementById("sugestoes-aprovadas")
  if (sugestoesAprovadas) {
    sugestoesAprovadas.textContent = problemas.filter((p) => p.status === "aprovado").length
  }

  // Estatísticas do gestor
  const totalDemandas = document.getElementById("total-demandas")
  if (totalDemandas) {
    totalDemandas.textContent = problemas.length
  }

  const pendentes = document.getElementById("pendentes")
  if (pendentes) {
    pendentes.textContent = problemas.filter((p) => p.status === "pendente").length
  }

  const emProgresso = document.getElementById("em-progresso")
  if (emProgresso) {
    emProgresso.textContent = problemas.filter((p) => p.status === "em_analise").length
  }

  const concluidas = document.getElementById("concluidas")
  if (concluidas) {
    concluidas.textContent = problemas.filter((p) => p.status === "concluido").length
  }
}

// Funções utilitárias
function getStatusText(status) {
  const statusMap = {
    pendente: "Pendente",
    em_analise: "Em Análise",
    aprovado: "Aprovado",
    rejeitado: "Rejeitado",
    concluido: "Concluído",
  }
  return statusMap[status] || "Indefinido"
}

function getProjectStatusText(status) {
  const statusMap = {
    atribuido: "Atribuído",
    em_progresso: "Em Progresso",
    concluido: "Concluído",
  }
  return statusMap[status] || "Indefinido"
}

function getCategoryText(categoria) {
  const categoryMap = {
    infraestrutura: "Infraestrutura",
    iluminacao: "Iluminação",
    mobilidade: "Mobilidade",
    limpeza: "Limpeza",
    seguranca: "Segurança",
  }
  return categoryMap[categoria] || categoria
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("pt-BR")
}

// Fechar modal ao clicar fora
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    e.target.classList.remove("active")
  }
})

// Animações e efeitos visuais
function addNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === "success" ? "#10b981" : "#ef4444"};
    color: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}
