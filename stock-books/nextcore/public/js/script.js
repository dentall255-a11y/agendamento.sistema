let books = [];
let editingId = null;

/* =========================
   BUSCAR LIVROS (API)
========================= */
async function fetchBooks() {
  try {
    const res = await fetch('/books');
    const json = await res.json();
    books = json.data;
    renderTable();
  } catch (err) {
    showToast('Erro ao carregar livros.', 'error');
  }
}

/* =========================
   RENDER TABELA
========================= */
function renderTable() {
  const q = document.getElementById('searchInput').value.toLowerCase();

  const filtered = books.filter(b =>
    b.titulo.toLowerCase().includes(q) ||
    b.autor.toLowerCase().includes(q) ||
    (b.genero || '').toLowerCase().includes(q)
  );

  const tbody = document.getElementById('tableBody');

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--muted)">Nenhum livro encontrado</td></tr>`;
    updateStats();
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

  updateStats();
}

/* =========================
   STATS
========================= */
function updateStats() {
  document.getElementById('stat-livros').textContent = books.length;

  const totalQtd = books.reduce((s, b) => s + b.qtd, 0);
  document.getElementById('stat-itens').textContent = totalQtd;

  const totalVal = books.reduce((s, b) => s + (b.qtd * parseFloat(b.preco)), 0);
  document.getElementById('stat-valor').textContent =
    'R$ ' + totalVal.toFixed(2).replace('.', ',');
}

/* =========================
   MODAL
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
    if (!b) return;

    editingId = id;

    document.getElementById('modalTitle').textContent = 'Editar Livro';
    document.getElementById('fTitulo').value = b.titulo;
    document.getElementById('fAutor').value = b.autor;
    document.getElementById('fGenero').value = b.genero;
    document.getElementById('fQtd').value = b.qtd;
    document.getElementById('fPreco').value = b.preco;
  }

  document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}

function closeModalIfOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

/* =========================
   SALVAR (API)
========================= */
async function saveBook() {
  const titulo = document.getElementById('fTitulo').value.trim();
  const autor = document.getElementById('fAutor').value.trim();
  const genero = document.getElementById('fGenero').value;
  const qtd = parseInt(document.getElementById('fQtd').value);
  const preco = parseFloat(document.getElementById('fPreco').value);

  if (!titulo || !autor || isNaN(qtd) || isNaN(preco)) {
    showToast('⚠️ Preencha todos os campos obrigatórios.', 'error');
    return;
  }

  const data = { titulo, autor, genero, qtd, preco };

  try {
    if (editingId !== null) {
      await fetch(`/books/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      showToast('✅ Livro atualizado com sucesso!', 'success');
    } else {
      await fetch('/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      showToast('✅ Livro adicionado com sucesso!', 'success');
    }

    closeModal();
    fetchBooks();

  } catch (err) {
    showToast('Erro ao salvar livro.', 'error');
  }
}

/* =========================
   DELETAR (API)
========================= */
async function deleteBook(id) {
  if (!confirm('Deseja remover este livro?')) return;

  try {
    await fetch(`/books/${id}`, {
      method: 'DELETE'
    });

    showToast('🗑️ Livro removido.', 'success');
    fetchBooks();

  } catch (err) {
    showToast('Erro ao remover livro.', 'error');
  }
}

/* =========================
   FUNÇÕES EXTRAS
========================= */
function editFirst() {
  if (books.length === 0) {
    showToast('Nenhum livro para editar.', 'error');
    return;
  }
  openModal('edit', books[0].id);
}

function removeFirst() {
  if (books.length === 0) {
    showToast('Nenhum livro para remover.', 'error');
    return;
  }
  deleteBook(books[0].id);
}

function focusSearch() {
  document.getElementById('searchInput').focus();
  document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
}

/* =========================
   TOAST
========================= */
let toastTimer;

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.classList.remove('show');
  }, 3000);
}

// ... (mantenha suas variáveis de estado)

async function saveBook() {
    const titulo = document.getElementById('fTitulo').value.trim();
    const autor = document.getElementById('fAutor').value.trim();
    const genero = document.getElementById('fGenero').value;
    const qtd = parseInt(document.getElementById('fQtd').value);
    const preco = parseFloat(document.getElementById('fPreco').value);

    if (!titulo || !autor || isNaN(qtd) || isNaN(preco)) {
        showToast('⚠️ Preencha os campos.', 'error');
        return;
    }

    const data = { titulo, autor, genero, qtd, preco };
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    try {
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `/books/${editingId}` : '/books';

        await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken 
            },
            body: JSON.stringify(data)
        });

        showToast(editingId ? '✅ Atualizado!' : '✅ Adicionado!', 'success');
        closeModal();
        fetchBooks();
    } catch (err) {
        showToast('Erro ao processar.', 'error');
    }
}

// ... (as demais funções de render e modal permanecem as mesmas)

/* =========================
   ANIMAÇÕES
========================= */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

/* =========================
   SCROLL SUAVE
========================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* =========================
   ESC FECHA MODAL
========================= */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* =========================
   INICIALIZAÇÃO
========================= */
fetchBooks();