let books = [];
let editingId = null;

/* =========================
   BUSCAR LIVROS (API)
========================= */
async function fetchBooks() {
  try {
    const res = await fetch('/books');
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    
    const json = await res.json();
    books = json.data || [];
    renderTable();
    updateStats();
  } catch (err) {
    console.error('Erro ao carregar livros:', err);
    showToast('❌ Erro ao carregar livros.', 'error');
  }
}

/* =========================
   RENDER TABELA
========================= */
function renderTable() {
  const q = document.getElementById('searchInput')?.value.toLowerCase() || '';

  const filtered = books.filter(b =>
    b.titulo.toLowerCase().includes(q) ||
    b.autor.toLowerCase().includes(q) ||
    (b.genero || '').toLowerCase().includes(q)
  );

  const tbody = document.getElementById('tableBody');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--muted)">Nenhum livro encontrado</td></tr>`;
    updateStats(); // Atualiza stats mesmo com resultado vazio
    return;
  }

  tbody.innerHTML = filtered.map(b => `
    <tr>
      <td><strong>${b.titulo}</strong></td>
      <td style="color:var(--muted)">${b.autor}</td>
      <td style="color:var(--muted)">${b.genero || '-'}</td>
      <td>${b.qtd}</td>
      <td>R$ ${parseFloat(b.preco).toFixed(2)}</td>
      <td>
        <div class="actions">
          <button class="action-btn" onclick="openModal('edit', ${b.id})" title="Editar">✏️</button>
          <button class="action-btn delete" onclick="deleteBook(${b.id})" title="Remover">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');

  updateStats(); // Atualiza stats após renderizar tabela
}

/* =========================
   STATS
========================= */
function updateStats() {
  const livrosEl = document.getElementById('stat-livros');
  const itensEl = document.getElementById('stat-itens');
  const valorEl = document.getElementById('stat-valor');

  if (livrosEl) livrosEl.textContent = books.length;

  if (itensEl) {
    const totalQtd = books.reduce((s, b) => s + (parseInt(b.qtd) || 0), 0);
    itensEl.textContent = totalQtd;
  }

  if (valorEl) {
    const totalVal = books.reduce((s, b) => s + ((parseInt(b.qtd) || 0) * parseFloat(b.preco || 0)), 0);
    valorEl.textContent = 'R$ ' + totalVal.toFixed(2).replace('.', ',');
  }
}

/* =========================
   MODAL - ABRIR
========================= */
function openModal(mode, id = null) {
  editingId = null;

  document.getElementById('modalTitle').textContent = 'Adicionar Livro';
  document.getElementById('fTitulo').value = '';
  document.getElementById('fAutor').value = '';
  document.getElementById('fGenero').value = 'Ficção';
  document.getElementById('fQtd').value = '';
  document.getElementById('fPreco').value = '';

  if (mode === 'edit' && id !== null) {
    const b = books.find(x => x.id === id);
    if (!b) {
      showToast('⚠️ Livro não encontrado.', 'error');
      return;
    }

    editingId = id;
    document.getElementById('modalTitle').textContent = 'Editar Livro';
    document.getElementById('fTitulo').value = b.titulo;
    document.getElementById('fAutor').value = b.autor;
    document.getElementById('fGenero').value = b.genero || 'Ficção';
    document.getElementById('fQtd').value = b.qtd;
    document.getElementById('fPreco').value = b.preco;
  }

  document.getElementById('modalOverlay').classList.add('active');
}

/* =========================
   MODAL - FECHAR
========================= */
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}

function closeModalIfOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

/* =========================
   SALVAR LIVRO (API) - ÚNICA VERSÃO
========================= */
async function saveBook() {
  const titulo = document.getElementById('fTitulo').value.trim();
  const autor = document.getElementById('fAutor').value.trim();
  const genero = document.getElementById('fGenero').value.trim();
  const qtd = parseInt(document.getElementById('fQtd').value);
  const preco = parseFloat(document.getElementById('fPreco').value);

  // Validação rigorosa
  if (!titulo || !autor) {
    showToast('⚠️ Título e Autor são obrigatórios.', 'error');
    return;
  }

  if (isNaN(qtd) || qtd < 0) {
    showToast('⚠️ Quantidade inválida.', 'error');
    return;
  }

  if (isNaN(preco) || preco < 0) {
    showToast('⚠️ Preço inválido.', 'error');
    return;
  }

  const data = { titulo, autor, genero, qtd, preco };
  const method = editingId ? 'PUT' : 'POST';
  const url = editingId ? `/books/${editingId}` : '/books';

  try {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const response = await fetch(url, {
      method: method,
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let errorMsg = `Erro ${response.status}`;
      try {
        const error = await response.json();
        errorMsg = error.message || errorMsg;
      } catch (e) {
        // Se não conseguir parsear JSON, usa mensagem padrão
      }
      throw new Error(errorMsg);
    }

    showToast(editingId ? '✅ Livro atualizado!' : '✅ Livro adicionado!', 'success');
    closeModal();
    fetchBooks();
  } catch (err) {
    console.error('Erro ao salvar:', err);
    showToast('❌ ' + err.message, 'error');
  }
}

/* =========================
   DELETAR LIVRO (API)
========================= */
async function deleteBook(id) {
  if (!confirm('Deseja remover este livro?')) return;

  try {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const response = await fetch(`/books/${id}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-TOKEN': token
      }
    });

    if (!response.ok) {
      let errorMsg = `Erro ${response.status}`;
      try {
        const error = await response.json();
        errorMsg = error.message || errorMsg;
      } catch (e) {
        // Se não conseguir parsear JSON, usa mensagem padrão
      }
      throw new Error(errorMsg);
    }

    showToast('🗑️ Livro removido.', 'success');
    fetchBooks();
  } catch (err) {
    console.error('Erro ao deletar:', err);
    showToast('❌ Erro ao remover: ' + err.message, 'error');
  }
}

/* =========================
   FUNÇÕES AUXILIARES
========================= */
function editFirst() {
  if (books.length === 0) {
    showToast('⚠️ Nenhum livro para editar.', 'error');
    return;
  }
  openModal('edit', books[0].id);
}

function removeFirst() {
  if (books.length === 0) {
    showToast('⚠️ Nenhum livro para remover.', 'error');
    return;
  }
  deleteBook(books[0].id);
}

function focusSearch() {
  const searchInput = document.getElementById('searchInput');
  const dashboard = document.getElementById('dashboard');
  
  if (searchInput) searchInput.focus();
  if (dashboard) dashboard.scrollIntoView({ behavior: 'smooth' });
}

/* =========================
   TOAST NOTIFICAÇÕES
========================= */
let toastTimer;

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;

  t.textContent = msg;
  t.className = `toast ${type} show`;

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.classList.remove('show');
  }, 3000);
}

/* =========================
   ANIMAÇÕES & EVENTOS
========================= */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* =========================
   INICIALIZAÇÃO
========================= */
document.addEventListener('DOMContentLoaded', () => {
  fetchBooks();
});