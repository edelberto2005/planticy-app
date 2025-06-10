// Variáveis do mapa
let maringaMap = null
let markersLayer = null

// Coordenadas de Maringá
const MARINGA_CENTER = [-23.4205, -51.9331]
const MARINGA_BOUNDS = [
  [-23.48, -52.02], // Southwest
  [-23.36, -51.84], // Northeast
]

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
    lat: -23.4205,
    lng: -51.9331,
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
    lat: -23.41,
    lng: -51.92,
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
    lat: -23.43,
    lng: -51.94,
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
    lat: -23.415,
    lng: -51.928,
  },
  {
    id: 5,
    titulo: "Limpeza do Parque do Ingá",
    descricao: "Necessidade de limpeza e manutenção do Parque do Ingá",
    categoria: "limpeza",
    status: "aprovado",
    votos: 32,
    autor: "Carla Oliveira",
    data: "2024-01-12",
    bairro: "Zona 1",
    prioridade: "media",
    estimativa: "R$ 2.500",
    prazoEstimado: "10 dias",
    lat: -23.418,
    lng: -51.935,
  },
  {
    id: 6,
    titulo: "Segurança na UEM",
    descricao: "Melhorar a iluminação e segurança nos arredores da UEM",
    categoria: "seguranca",
    status: "em_analise",
    votos: 67,
    autor: "Roberto Silva",
    data: "2024-01-08",
    bairro: "Zona 7",
    prioridade: "alta",
    estimativa: "R$ 15.000",
    prazoEstimado: "30 dias",
    lat: -23.405,
    lng: -51.91,
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

  // Usar coordenadas do mapa se disponível, senão usar coordenadas padrão
  const coords = window.selectedMapLocation || {
    lat: MARINGA_CENTER[0] + (Math.random() - 0.5) * 0.02,
    lng: MARINGA_CENTER[1] + (Math.random() - 0.5) * 0.02,
  }

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
    lat: coords.lat,
    lng: coords.lng,
  }

  problemas.unshift(novoProblema)
  loadProblems()
  loadGestorProblems()
  updateStats()

  // Atualizar mapa se estiver visível
  if (maringaMap) {
    updateMapMarkers()
  }

  closeReportModal()

  // Limpar coordenadas selecionadas
  window.selectedMapLocation = null

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

// Navegação da Sidebar
function showSection(sectionId, userType) {
  // Esconder todas as seções
  const sections = document.querySelectorAll(".dashboard-section, .problems-section")
  sections.forEach((section) => {
    section.style.display = "none"
  })

  // Mostrar seção selecionada
  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    targetSection.style.display = "block"
  }

  // Atualizar menu ativo
  const menuItems = document.querySelectorAll(".sidebar-menu a")
  menuItems.forEach((item) => {
    item.classList.remove("active")
  })

  // Carregar dados específicos da seção
  switch (sectionId) {
    case "mapa-cidade-section":
      loadMapProblems()
      // Inicializar mapa após um pequeno delay para garantir que o elemento esteja visível
      setTimeout(() => {
        if (document.getElementById("maringa-map") && !maringaMap) {
          initializeMap()
        }
      }, 100)
      break
    case "minhas-sugestoes-section":
      loadMinhasSugestoes()
      break
    case "configuracoes-section":
      loadConfiguracoes()
      break
    case "demandas-cidadas-section":
      loadTodasDemandas()
      break
    case "especialistas-section":
      loadEspecialistas()
      break
    case "orcamentos-section":
      loadOrcamentos()
      break
    case "feedback-section":
      loadFeedbacks()
      break
    default:
      // Dashboard principal
      if (sectionId.includes("dashboard")) {
        document.querySelector(".problems-section").style.display = "block"
      }
  }
}

// Atualizar event listeners da sidebar
document.addEventListener("DOMContentLoaded", () => {
  // Event listeners para cidadão
  const cidadaoLinks = document.querySelectorAll("#dashboard-cidadao .sidebar-menu a")
  cidadaoLinks.forEach((link, index) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      cidadaoLinks.forEach((l) => l.classList.remove("active"))
      link.classList.add("active")

      switch (index) {
        case 0: // Dashboard
          showSection("dashboard", "cidadao")
          document.querySelector("#dashboard-cidadao .problems-section").style.display = "block"
          break
        case 1: // Mapa da Cidade
          showSection("mapa-cidade-section", "cidadao")
          break
        case 2: // Minhas Sugestões
          showSection("minhas-sugestoes-section", "cidadao")
          break
        case 3: // Configurações
          showSection("configuracoes-section", "cidadao")
          break
      }
    })
  })

  // Event listeners para gestor
  const gestorLinks = document.querySelectorAll("#dashboard-gestor .sidebar-menu a")
  gestorLinks.forEach((link, index) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      gestorLinks.forEach((l) => l.classList.remove("active"))
      link.classList.add("active")

      switch (index) {
        case 0: // Dashboard
          showSection("dashboard", "gestor")
          document.querySelector("#dashboard-gestor .problems-section").style.display = "block"
          break
        case 1: // Mapa da Cidade
          showSection("mapa-cidade-section", "gestor")
          break
        case 2: // Demandas Cidadãs
          showSection("demandas-cidadas-section", "gestor")
          break
        case 3: // Especialistas
          showSection("especialistas-section", "gestor")
          break
      }
    })
  })

  // Event listeners para especialista
  const especialistaLinks = document.querySelectorAll("#dashboard-especialista .sidebar-menu a")
  especialistaLinks.forEach((link, index) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      especialistaLinks.forEach((l) => l.classList.remove("active"))
      link.classList.add("active")

      switch (index) {
        case 0: // Dashboard
          showSection("dashboard", "especialista")
          document.querySelector("#dashboard-especialista .problems-section").style.display = "block"
          break
        case 1: // Projetos Atribuídos
          showSection("dashboard", "especialista")
          document.querySelector("#dashboard-especialista .problems-section").style.display = "block"
          break
        case 2: // Orçamentos
          showSection("orcamentos-section", "especialista")
          break
        case 3: // Feedback
          showSection("feedback-section", "especialista")
          break
      }
    })
  })

  // Event listeners para formulários
  document.getElementById("profile-form")?.addEventListener("submit", handleProfileUpdate)
  document.getElementById("add-specialist-form")?.addEventListener("submit", handleAddSpecialist)
  document.getElementById("assign-project-form")?.addEventListener("submit", handleAssignProject)

  // Event listeners para filtros
  document.getElementById("map-filter")?.addEventListener("change", loadMapProblems)
  document.getElementById("demandas-filter")?.addEventListener("change", loadTodasDemandas)
  document.getElementById("demandas-prioridade")?.addEventListener("change", loadTodasDemandas)
  document.getElementById("feedback-filter")?.addEventListener("change", loadFeedbacks)
})

// Funções para carregar dados das seções

function loadMapProblems() {
  // Inicializar mapa se não existir
  if (!maringaMap && document.getElementById("maringa-map")) {
    setTimeout(initializeMap, 100)
  } else if (maringaMap) {
    updateMapMarkers()
  }

  // Carregar lista de problemas
  const container = document.getElementById("map-problems-container")
  if (!container) return

  const filtro = document.getElementById("map-filter")?.value || "todos"
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
          <button class="btn btn-primary" onclick="focusMapOnProblem(${problema.id})">
            <i class="fas fa-map-marker-alt"></i> Ver no Mapa
          </button>
          <button class="btn btn-secondary" onclick="showDetailsModal(${problema.id}, 'problema')">
            <i class="fas fa-eye"></i> Detalhes
          </button>
        </div>
      </div>
      <div class="problem-description">${problema.descricao}</div>
      <div class="problem-meta">
        <span><i class="fas fa-map-marker-alt"></i> ${problema.bairro}</span>
        <span><i class="fas fa-user"></i> ${problema.autor}</span>
        <span><i class="fas fa-calendar"></i> ${formatDate(problema.data)}</span>
      </div>
    </div>
  `,
    )
    .join("")
}

function loadMinhasSugestoes() {
  const container = document.getElementById("minhas-sugestoes-list")
  if (!container || !usuarioAtual) return

  const minhasSugestoes = problemas.filter((p) => p.autor === usuarioAtual.nome)

  // Atualizar estatísticas
  document.getElementById("total-sugestoes").textContent = minhasSugestoes.length
  document.getElementById("sugestoes-pendentes").textContent = minhasSugestoes.filter(
    (p) => p.status === "pendente",
  ).length
  document.getElementById("sugestoes-aprovadas-count").textContent = minhasSugestoes.filter(
    (p) => p.status === "aprovado",
  ).length

  container.innerHTML = minhasSugestoes
    .map(
      (problema) => `
    <div class="problem-card">
      <div class="problem-header">
        <div>
          <div class="problem-title">${problema.titulo}</div>
          <span class="status-badge status-${problema.status}">${getStatusText(problema.status)}</span>
        </div>
        <div class="problem-actions">
          <button class="btn btn-primary" onclick="showDetailsModal(${problema.id}, 'problema')">
            <i class="fas fa-eye"></i> Ver Detalhes
          </button>
          <button class="btn btn-secondary" onclick="editarSugestao(${problema.id})">
            <i class="fas fa-edit"></i> Editar
          </button>
        </div>
      </div>
      <div class="problem-description">${problema.descricao}</div>
      <div class="problem-meta">
        <span><i class="fas fa-map-marker-alt"></i> ${problema.bairro}</span>
        <span><i class="fas fa-calendar"></i> ${formatDate(problema.data)}</span>
        <span><i class="fas fa-thumbs-up"></i> ${problema.votos} votos</span>
      </div>
    </div>
  `,
    )
    .join("")
}

function loadConfiguracoes() {
  if (usuarioAtual) {
    document.getElementById("profile-name").value = usuarioAtual.nome
  }
}

function loadTodasDemandas() {
  const container = document.getElementById("todas-demandas-list")
  if (!container) return

  const filtroStatus = document.getElementById("demandas-filter")?.value || "todos"
  const filtroPrioridade = document.getElementById("demandas-prioridade")?.value || "todos"

  let demandasFiltradas = problemas

  if (filtroStatus !== "todos") {
    demandasFiltradas = demandasFiltradas.filter((p) => p.status === filtroStatus)
  }

  if (filtroPrioridade !== "todos") {
    demandasFiltradas = demandasFiltradas.filter((p) => p.prioridade === filtroPrioridade)
  }

  container.innerHTML = demandasFiltradas
    .map(
      (problema) => `
    <div class="problem-card">
      <div class="problem-header">
        <div>
          <div class="problem-title">${problema.titulo}</div>
          <span class="status-badge status-${problema.status}">${getStatusText(problema.status)}</span>
          <span class="status-badge status-${problema.prioridade}" style="margin-left: 0.5rem;">
            ${problema.prioridade?.charAt(0).toUpperCase() + problema.prioridade?.slice(1)}
          </span>
        </div>
        <div class="problem-actions">
          <button class="btn btn-primary" onclick="showDetailsModal(${problema.id}, 'problema')">
            <i class="fas fa-eye"></i> Ver Detalhes
          </button>
          <button class="btn btn-warning" onclick="alterarStatus(${problema.id}, 'em_analise')">
            <i class="fas fa-search"></i> Analisar
          </button>
        </div>
      </div>
      <div class="problem-description">${problema.descricao}</div>
      <div class="problem-meta">
        <span><i class="fas fa-map-marker-alt"></i> ${problema.bairro}</span>
        <span><i class="fas fa-user"></i> ${problema.autor}</span>
        <span><i class="fas fa-calendar"></i> ${formatDate(problema.data)}</span>
        <span><i class="fas fa-thumbs-up"></i> ${problema.votos} votos</span>
      </div>
    </div>
  `,
    )
    .join("")
}

function loadOrcamentos() {
  const container = document.getElementById("orcamentos-list")
  if (!container) return

  // Dados simulados de orçamentos
  const orcamentosSimulados = [
    {
      id: 1,
      titulo: "Reparo da Avenida Brasil",
      projeto: "Projeto #001",
      valor: 15000,
      status: "aprovado",
      data: "2024-01-15",
      itens: ["Asfalto: R$ 8.000", "Mão de obra: R$ 5.000", "Equipamentos: R$ 2.000"],
    },
    {
      id: 2,
      titulo: "Iluminação Zona 7",
      projeto: "Projeto #002",
      valor: 8500,
      status: "pendente",
      data: "2024-01-20",
      itens: ["Postes: R$ 4.000", "Lâmpadas LED: R$ 2.500", "Instalação: R$ 2.000"],
    },
    {
      id: 3,
      titulo: "Semáforo Av. Colombo",
      projeto: "Projeto #003",
      valor: 3200,
      status: "em_analise",
      data: "2024-01-18",
      itens: ["Controlador: R$ 1.500", "Lâmpadas: R$ 800", "Instalação: R$ 900"],
    },
  ]

  container.innerHTML = orcamentosSimulados
    .map(
      (orcamento) => `
    <div class="budget-card">
      <div class="budget-header">
        <div>
          <div class="budget-title">${orcamento.titulo}</div>
          <span class="status-badge status-${orcamento.status}">${getStatusText(orcamento.status)}</span>
        </div>
        <div class="problem-actions">
          <button class="btn btn-primary" onclick="viewBudgetDetails(${orcamento.id})">
            <i class="fas fa-eye"></i> Ver Detalhes
          </button>
          <button class="btn btn-secondary" onclick="editBudget(${orcamento.id})">
            <i class="fas fa-edit"></i> Editar
          </button>
        </div>
      </div>
      <div class="budget-meta">
        <span><i class="fas fa-project-diagram"></i> ${orcamento.projeto}</span>
        <span><i class="fas fa-calendar"></i> ${formatDate(orcamento.data)}</span>
        <span><i class="fas fa-dollar-sign"></i> R$ ${orcamento.valor.toLocaleString()}</span>
      </div>
      <div class="budget-items">
        ${orcamento.itens.map((item) => `<div class="budget-item"><span>${item}</span></div>`).join("")}
        <div class="budget-total">
          <span>Total: R$ ${orcamento.valor.toLocaleString()}</span>
        </div>
      </div>
    </div>
  `,
    )
    .join("")
}

function loadFeedbacks() {
  const container = document.getElementById("feedback-list")
  if (!container) return

  const filtro = document.getElementById("feedback-filter")?.value || "todos"

  // Dados simulados de feedbacks
  const feedbacksSimulados = [
    {
      id: 1,
      autor: "Maria Silva",
      tipo: "elogio",
      rating: 5,
      mensagem: "Excelente trabalho na Avenida Brasil! O trânsito melhorou muito.",
      data: "2024-01-25",
      projeto: "Reparo da Avenida Brasil",
    },
    {
      id: 2,
      autor: "João Santos",
      tipo: "sugestao",
      rating: 4,
      mensagem: "Seria bom adicionar mais sinalização na área reparada.",
      data: "2024-01-26",
      projeto: "Reparo da Avenida Brasil",
    },
    {
      id: 3,
      autor: "Ana Costa",
      tipo: "duvida",
      rating: 3,
      mensagem: "Quando será iniciado o projeto da praça no Jardim Alvorada?",
      data: "2024-01-24",
      projeto: "Praça Jardim Alvorada",
    },
    {
      id: 4,
      autor: "Carlos Oliveira",
      tipo: "reclamacao",
      rating: 2,
      mensagem: "O semáforo ainda não foi consertado completamente.",
      data: "2024-01-23",
      projeto: "Semáforo Av. Colombo",
    },
  ]

  const feedbacksFiltrados =
    filtro === "todos" ? feedbacksSimulados : feedbacksSimulados.filter((f) => f.tipo === filtro)

  container.innerHTML = feedbacksFiltrados
    .map(
      (feedback) => `
    <div class="feedback-card">
      <div class="feedback-header">
        <div>
          <div class="feedback-author">${feedback.autor}</div>
          <div class="feedback-date">${formatDate(feedback.data)}</div>
        </div>
        <div>
          <div class="feedback-rating">
            ${Array.from(
              { length: 5 },
              (_, i) => `<span class="star ${i < feedback.rating ? "active" : ""}">★</span>`,
            ).join("")}
          </div>
          <span class="feedback-type ${feedback.tipo}">
            <i class="fas fa-${feedback.tipo === "elogio" ? "thumbs-up" : feedback.tipo === "sugestao" ? "lightbulb" : feedback.tipo === "reclamacao" ? "thumbs-down" : "question"}"></i>
            ${feedback.tipo.charAt(0).toUpperCase() + feedback.tipo.slice(1)}
          </span>
        </div>
      </div>
      <div class="feedback-message">${feedback.mensagem}</div>
      <div class="problem-meta">
        <span><i class="fas fa-project-diagram"></i> ${feedback.projeto}</span>
      </div>
      <div class="feedback-actions">
        <button class="btn btn-primary" onclick="respondFeedback(${feedback.id})">
          <i class="fas fa-reply"></i> Responder
        </button>
        <button class="btn btn-secondary" onclick="markFeedbackRead(${feedback.id})">
          <i class="fas fa-check"></i> Marcar como Lido
        </button>
      </div>
    </div>
  `,
    )
    .join("")
}

function loadEspecialistas() {
  const container = document.getElementById("especialistas-list")
  if (!container) return

  // Dados simulados de especialistas
  const especialistasSimulados = [
    {
      id: 1,
      nome: "João Silva",
      especialidade: "Infraestrutura",
      email: "joao.silva@example.com",
      telefone: "123456789",
      experiencia: "5 anos",
    },
    {
      id: 2,
      nome: "Maria Santos",
      especialidade: "Iluminação",
      email: "maria.santos@example.com",
      telefone: "987654321",
      experiencia: "3 anos",
    },
  ]

  container.innerHTML = especialistasSimulados
    .map(
      (especialista) => `
    <div class="specialist-card">
      <div class="specialist-header">
        <div>
          <div class="specialist-name">${especialista.nome}</div>
          <span class="specialist-specialty">${especialista.especialidade}</span>
        </div>
        <div class="specialist-actions">
          <button class="btn btn-primary" onclick="viewSpecialistDetails(${especialista.id})">
            <i class="fas fa-eye"></i> Ver Detalhes
          </button>
          <button class="btn btn-secondary" onclick="assignProject(${especialista.id})">
            <i class="fas fa-tasks"></i> Atribuir Projeto
          </button>
        </div>
      </div>
      <div class="specialist-meta">
        <span><i class="fas fa-envelope"></i> ${especialista.email}</span>
        <span><i class="fas fa-phone"></i> ${especialista.telefone}</span>
        <span><i class="fas fa-hourglass-half"></i> ${especialista.experiencia}</span>
      </div>
    </div>
  `,
    )
    .join("")
}

// Funções para modais de especialistas

function showAddSpecialistModal() {
  document.getElementById("add-specialist-modal").classList.add("active")
}

function closeAddSpecialistModal() {
  document.getElementById("add-specialist-modal").classList.remove("active")
  document.getElementById("add-specialist-form").reset()
}

function showAssignProjectModal(specialistId) {
  const modal = document.getElementById("assign-project-modal")
  const select = document.getElementById("assign-project-select")

  // Carregar projetos disponíveis
  select.innerHTML = '<option value="">Selecione um projeto</option>'
  projetos.forEach((projeto) => {
    if (projeto.status === "atribuido") {
      const option = document.createElement("option")
      option.value = projeto.id
      option.textContent = projeto.titulo
      select.appendChild(option)
    }
  })

  modal.classList.add("active")
  modal.dataset.specialistId = specialistId
}

function closeAssignProjectModal() {
  document.getElementById("assign-project-modal").classList.remove("active")
  document.getElementById("assign-project-form").reset()
}

// Handlers para formulários

function handleProfileUpdate(e) {
  e.preventDefault()

  const nome = document.getElementById("profile-name").value
  const email = document.getElementById("profile-email").value
  const phone = document.getElementById("profile-phone").value
  const neighborhood = document.getElementById("profile-neighborhood").value

  // Atualizar dados do usuário
  if (usuarioAtual) {
    usuarioAtual.nome = nome
    usuarioAtual.email = email
    usuarioAtual.phone = phone
    usuarioAtual.neighborhood = neighborhood

    localStorage.setItem("usuario", JSON.stringify(usuarioAtual))
  }

  alert("Perfil atualizado com sucesso!")
}

function handleAddSpecialist(e) {
  e.preventDefault()

  const name = document.getElementById("specialist-name").value
  const specialty = document.getElementById("specialist-specialty").value
  const email = document.getElementById("specialist-email").value
  const phone = document.getElementById("specialist-phone").value
  const experience = document.getElementById("specialist-experience").value

  // Simular adição do especialista
  console.log("Novo especialista:", { name, specialty, email, phone, experience })

  closeAddSpecialistModal()
  alert("Especialista adicionado com sucesso!")
}

function handleAssignProject(e) {
  e.preventDefault()

  const projectId = document.getElementById("assign-project-select").value
  const deadline = document.getElementById("assign-deadline").value
  const priority = document.getElementById("assign-priority").value
  const notes = document.getElementById("assign-notes").value

  // Simular atribuição do projeto
  console.log("Projeto atribuído:", { projectId, deadline, priority, notes })

  closeAssignProjectModal()
  alert("Projeto atribuído com sucesso!")
}

// Funções auxiliares

function editarSugestao(id) {
  const problema = problemas.find((p) => p.id === id)
  if (problema && problema.autor === usuarioAtual?.nome) {
    // Implementar edição
    alert("Funcionalidade de edição em desenvolvimento")
  }
}

function viewSpecialistDetails(id) {
  alert(`Ver detalhes do especialista ${id}`)
}

function assignProject(specialistId) {
  showAssignProjectModal(specialistId)
}

function viewBudgetDetails(id) {
  alert(`Ver detalhes do orçamento ${id}`)
}

function editBudget(id) {
  alert(`Editar orçamento ${id}`)
}

function respondFeedback(id) {
  alert(`Responder feedback ${id}`)
}

function markFeedbackRead(id) {
  alert(`Feedback ${id} marcado como lido`)
}

// Funções do Mapa
function initializeMap() {
  if (maringaMap) {
    maringaMap.remove()
  }

  // Criar o mapa centrado em Maringá
  maringaMap = L.map("maringa-map").setView(MARINGA_CENTER, 13)

  // Adicionar camada do OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 18,
    minZoom: 10,
  }).addTo(maringaMap)

  // Limitar a visualização à região de Maringá
  maringaMap.setMaxBounds(MARINGA_BOUNDS)

  // Criar camada para os marcadores
  markersLayer = L.layerGroup().addTo(maringaMap)

  // Adicionar marcadores dos problemas
  updateMapMarkers()

  // Adicionar evento de clique no mapa para reportar problemas
  maringaMap.on("click", (e) => {
    if (confirm("Deseja reportar um problema neste local?")) {
      // Armazenar coordenadas para uso no modal
      window.selectedMapLocation = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      }
      showReportModal()
    }
  })
}

function updateMapMarkers() {
  if (!markersLayer) return

  // Limpar marcadores existentes
  markersLayer.clearLayers()

  // Filtrar problemas
  const filtro = document.getElementById("map-filter")?.value || "todos"
  const problemasFiltrados = filtro === "todos" ? problemas : problemas.filter((p) => p.categoria === filtro)

  // Adicionar marcadores
  problemasFiltrados.forEach((problema) => {
    if (problema.lat && problema.lng) {
      const marker = createProblemMarker(problema)
      markersLayer.addLayer(marker)
    }
  })

  // Atualizar estatísticas
  updateMapStats(problemasFiltrados)
}

function createProblemMarker(problema) {
  // Definir cor do marcador baseado no status
  const markerColor = getMarkerColor(problema.status, problema.prioridade)

  // Criar ícone customizado
  const customIcon = L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background-color: ${markerColor};
      width: 25px;
      height: 25px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 12px;
    ">${getCategoryIcon(problema.categoria)}</div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  })

  // Criar marcador
  const marker = L.marker([problema.lat, problema.lng], { icon: customIcon })

  // Criar popup
  const popupContent = `
    <div class="popup-content">
      <div class="popup-title">${problema.titulo}</div>
      <div class="popup-description">${problema.descricao}</div>
      <div class="popup-meta">
        <span><i class="fas fa-map-marker-alt"></i> ${problema.bairro}</span>
        <span><i class="fas fa-user"></i> ${problema.autor}</span>
      </div>
      <div class="popup-meta">
        <span><i class="fas fa-calendar"></i> ${formatDate(problema.data)}</span>
        <span><i class="fas fa-thumbs-up"></i> ${problema.votos} votos</span>
      </div>
      <span class="status-badge status-${problema.status}">${getStatusText(problema.status)}</span>
      <div class="popup-actions">
        <button class="popup-btn popup-btn-primary" onclick="showDetailsModal(${problema.id}, 'problema')">
          <i class="fas fa-eye"></i> Detalhes
        </button>
        <button class="popup-btn popup-btn-secondary" onclick="votarProblema(${problema.id})">
          <i class="fas fa-thumbs-up"></i> Votar
        </button>
      </div>
    </div>
  `

  marker.bindPopup(popupContent, {
    maxWidth: 300,
    className: "custom-popup",
  })

  return marker
}

function getMarkerColor(status, prioridade) {
  if (prioridade === "urgente") return "#ef4444" // Vermelho

  switch (status) {
    case "pendente":
      return "#f59e0b" // Amarelo
    case "em_analise":
      return "#f59e0b" // Amarelo
    case "aprovado":
      return "#3b82f6" // Azul
    case "concluido":
      return "#10b981" // Verde
    case "rejeitado":
      return "#6b7280" // Cinza
    default:
      return "#6b7280"
  }
}

function getCategoryIcon(categoria) {
  const icons = {
    infraestrutura: "🚧",
    iluminacao: "💡",
    mobilidade: "🚗",
    limpeza: "🧹",
    seguranca: "🛡️",
  }
  return icons[categoria] || "📍"
}

function updateMapStats(problemas) {
  // Atualizar total de problemas
  const totalElement = document.getElementById("map-total-problems")
  if (totalElement) {
    totalElement.textContent = problemas.length
  }

  // Calcular região mais afetada
  const bairroCount = {}
  problemas.forEach((p) => {
    bairroCount[p.bairro] = (bairroCount[p.bairro] || 0) + 1
  })

  const mostAffected = Object.keys(bairroCount).reduce((a, b) => (bairroCount[a] > bairroCount[b] ? a : b), "Centro")

  const mostAffectedElement = document.getElementById("map-most-affected")
  if (mostAffectedElement) {
    mostAffectedElement.textContent = mostAffected
  }
}

function focusMapOnProblem(problemId) {
  const problema = problemas.find((p) => p.id === problemId)
  if (problema && problema.lat && problema.lng && maringaMap) {
    maringaMap.setView([problema.lat, problema.lng], 16)

    // Encontrar e abrir o popup do marcador
    markersLayer.eachLayer((layer) => {
      if (layer.getLatLng().lat === problema.lat && layer.getLatLng().lng === problema.lng) {
        layer.openPopup()
      }
    })
  }
}
