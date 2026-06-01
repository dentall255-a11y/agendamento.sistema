<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Next Core - Transformando Ideias em Soluções Digitais</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>

<nav>
    <a href="{{ route('home') }}" class="logo">
        <img src="{{ asset('img/logo.jpg') }}" alt="Next Core" class="logo-img">
        Next Core
    </a>
    <ul class="nav-links">
        <li><a href="#inicio">Início</a></li>
        <li><a href="#sobre">Sobre</a></li>
        <li><a href="#projeto">Projeto</a></li>
        <li><a href="#dashboard">Dashboard</a></li>
    </ul>
</nav>

<div id="inicio" class="hero">
    <div class="badge">✦ Transformando o Mercado</div>
    <h1>Transformando Ideias em<br><span>Soluções Digitais</span></h1>
    <p>Na Next Core, desenvolvemos sistemas inteligentes e eficientes para impulsionar o seu negócio ao próximo nível.</p>
    <div class="hero-btns">
        <a href="#projeto" class="btn-primary">Ver Projetos</a>
        <a href="#sobre" class="btn-secondary">Saiba Mais</a>
    </div>
</div>

<section id="sobre">
    <div class="features-grid fade-up">
        <div class="feature-card">
            <div class="feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24">
                    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill="white"/>
                </svg>
            </div>
            <h3>Alta Performance</h3>
            <p>Sistemas otimizados para máxima velocidade e eficiência operacional.</p>
        </div>

        <div class="feature-card">
            <div class="feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24">
                    <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" fill="white"/>
                </svg>
            </div>
            <h3>Segurança Avançada</h3>
            <p>Proteção de dados com as melhores práticas de segurança do mercado.</p>
        </div>

        <div class="feature-card">
            <div class="feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3L13.2 8.2L18 9.4L13.2 10.6L12 16L10.8 10.6L6 9.4L10.8 8.2L12 3Z" fill="white"/>
                    <path d="M18 15L18.6 17.4L21 18L18.6 18.6L18 21L17.4 18.6L15 18L17.4 17.4L18 15Z" fill="white"/>
                </svg>
            </div>
            <h3>Design Moderno</h3>
            <p>Interface elegante e intuitiva para melhor experiência do usuário.</p>
        </div>
    </div>
</section>

<div id="projeto" class="project-section fade-up">
    <div class="project-badge">● Projeto em Destaque</div>
    <h2 class="section-title">Sistema de Gerenciamento de Livros</h2>
    <p class="section-sub">Uma solução completa e moderna para gerenciar estoque de livros com eficiência e praticidade.</p>

    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon">📚</div>
            <div>
                <div class="stat-value" id="stat-livros">0</div>
                <div class="stat-label">Livros cadastrados</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">📦</div>
            <div>
                <div class="stat-value" id="stat-itens">0</div>
                <div class="stat-label">Itens em estoque</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div>
                <div class="stat-value" id="stat-valor">R$ 0,00</div>
                <div class="stat-label">Valor total do estoque</div>
            </div>
        </div>
    </div>

    <div class="functions-label">Funcionalidades do Sistema</div>
    <div class="functions-grid">
        <button class="func-btn" onclick="openModal('add')">
            <span class="icon">✨</span>
            Adicionar Livro
        </button>
        <button class="func-btn" onclick="editFirst()">
            <span class="icon">✏️</span>
            Editar Registros
        </button>
        <button class="func-btn" onclick="removeFirst()">
            <span class="icon">🗑️</span>
            Remover Itens
        </button>
        <button class="func-btn" onclick="focusSearch()">
            <span class="icon">🔍</span>
            Busca Inteligente
        </button>
    </div>
</div>

<div id="dashboard" class="dashboard-section fade-up">
    <h2 class="section-title">Dashboard Interativo</h2>
    <p class="section-sub">Gerencie seu estoque com facilidade e eficiência</p>

    <div class="search-container">
        <input type="text" id="searchInput" class="search-input" placeholder="🔍  Buscar por título, autor ou gênero..." oninput="renderTable()">
        <button class="btn-primary" onclick="openModal('add')">+ Adicionar Livro</button>
    </div>

    <div class="table-container">
        <div class="table-header">
            <h3>Estoque de Livros</h3>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Gênero</th>
                    <th>Quantidade</th>
                    <th>Preço</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody id="tableBody"></tbody>
        </table>
    </div>
</div>

<footer>
    <a href="{{ route('home') }}" class="logo">
        <img src="{{ asset('img/logo.jpg') }}" alt="Next Core" class="logo-img">
        Next Core
    </a>
    <span class="footer-copy">© 2026 Next Core. Todos os direitos reservados.</span>
    <div class="footer-socials">
        <a class="social-icon" href="#" title="GitHub">⌁</a>
        <a class="social-icon" href="#" title="LinkedIn">in</a>
    </div>
</footer>

<div class="modal-overlay" id="modalOverlay" onclick="closeModalIfOutside(event)">
    <div class="modal">
        <h2 id="modalTitle">Adicionar Livro</h2>
        <div class="form-group">
            <label>Título *</label>
            <input type="text" id="fTitulo" placeholder="Ex: Dom Casmurro">
        </div>
        <div class="form-group">
            <label>Autor *</label>
            <input type="text" id="fAutor" placeholder="Ex: Machado de Assis">
        </div>
        <div class="form-group">
            <label>Gênero</label>
            <select id="fGenero">
                <option value="Ficção">Ficção</option>
                <option value="Não-Ficção">Não-Ficção</option>
                <option value="Fantasia">Fantasia</option>
                <option value="Romance">Romance</option>
                <option value="Ficção Científica">Ficção Científica</option>
                <option value="Ficção Distópica">Ficção Distópica</option>
                <option value="Mistério">Mistério</option>
                <option value="Terror">Terror</option>
                <option value="Biografia">Biografia</option>
                <option value="História">História</option>
                <option value="Poesia">Poesia</option>
                <option value="Outro">Outro</option>
            </select>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Quantidade *</label>
                <input type="number" id="fQtd" placeholder="0" min="0">
            </div>
            <div class="form-group">
                <label>Preço (R$) *</label>
                <input type="number" id="fPreco" placeholder="0.00" step="0.01" min="0">
            </div>
        </div>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn-primary" onclick="saveBook()">Salvar</button>
        </div>
    </div>
</div>

<div class="toast" id="toast"></div>

<script src="{{ asset('js/script.js') }}" defer></script>
</body>
</html>