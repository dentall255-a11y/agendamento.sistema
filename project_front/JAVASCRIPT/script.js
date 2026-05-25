let books = [];
let editingId = null;

// 🔹 CARREGAR DADOS DO BACK-END COM ATUALIZAÇÃO EM SEGUNDO PLANO (CACHE-FIRST)
async function carregarLivros() {
  // 1. Carrega do localStorage imediatamente para uma UI instantânea
  const localBooks = localStorage.getItem("books_backup");
  if (localBooks) {
    books = JSON.parse(localBooks);
    renderTable();
  } else {
    books = [
      { id: 1, titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien', genero: 'Fantasia', qtd: 15, preco: 89.90 },
      { id: 2, titulo: '1984',               autor: 'George Orwell',  genero: 'Ficção Distópica', qtd: 8,  preco: 45.00 },
      { id: 3, titulo: 'Dom Casmurro',       autor: 'Machado de Assis', genero: 'Romance', qtd: 12, preco: 35.90 },
    ];
    localStorage.setItem("books_backup", JSON.stringify(books));
    renderTable();
  }

  // 2. Busca do back-end em segundo plano para sincronizar
  try {
    const resposta = await fetch("http://localhost:3000/livros");
    if (resposta.ok) {
      books = await resposta.json();
      localStorage.setItem("books_backup", JSON.stringify(books));
      renderTable();
    }
  } catch (erro) {
    console.warn("Back-end inacessível em segundo plano:", erro);
  }
}

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
        <td>R$ ${parseFloat(b.preco || 0).toFixed(2)}</td>
        <td>
          <div class="actions">
            <button class="action-btn" onclick="openModal('edit', ${b.id})">✏️</button>
            <button class="action-btn delete" onclick="deleteBook(${b.id})">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');

  updateStats();
}

function updateStats() {
  document.getElementById('stat-livros').textContent = books.length;
  const totalQtd = books.reduce((s, b) => s + (parseInt(b.qtd) || 0), 0);
  document.getElementById('stat-itens').textContent = totalQtd;
  const totalVal = books.reduce((s, b) => s + ((parseInt(b.qtd) || 0) * parseFloat(b.preco || 0)), 0);
  document.getElementById('stat-valor').textContent = 'R$ ' + totalVal.toFixed(2).replace('.', ',');
}

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

// 🔹 SALVAR (POST / PUT) COM RESILIÊNCIA E EXECUÇÃO INSTANTÂNEA
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

  const livro = { titulo, autor, genero, qtd, preco };

  try {
    // 1. Atualização local instantânea (Optimistic UI)
    if (editingId !== null) {
      const idx = books.findIndex(b => b.id === editingId);
      if (idx !== -1) {
        books[idx] = { id: editingId, ...livro };
      }
    } else {
      const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
      books.push({ id: newId, ...livro });
    }
    localStorage.setItem("books_backup", JSON.stringify(books));

    // Exibe notificação e fecha modal imediatamente
    showToast(editingId !== null ? '✅ Livro atualizado com sucesso!' : '✅ Livro adicionado com sucesso!', 'success');
    closeModal();
    renderTable();

    // 2. Sincronização em segundo plano (Assíncrona)
    const method = editingId !== null ? "PUT" : "POST";
    const url = editingId !== null ? `http://localhost:3000/livros/${editingId}` : "http://localhost:3000/livros";
    
    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(livro)
    }).then(async (res) => {
      if (res.ok) {
        const backendBook = await res.json();
        if (backendBook && backendBook.id && editingId === null) {
          const idx = books.findIndex(b => b.titulo === livro.titulo && b.autor === livro.autor && b.qtd === livro.qtd);
          if (idx !== -1) {
            books[idx].id = backendBook.id;
            localStorage.setItem("books_backup", JSON.stringify(books));
            renderTable();
          }
        }
      }
    }).catch(e => console.warn("Erro ao sincronizar com o back-end (segundo plano):", e));

  } catch (erro) {
    console.error("Erro ao salvar:", erro);
    showToast('❌ Erro ao salvar.', 'error');
  }
}

// 🔹 DELETAR COM RESILIÊNCIA E EXECUÇÃO INSTANTÂNEA
async function deleteBook(id) {
  if (!confirm('Deseja remover este livro?')) return;

  try {
    // 1. Remoção local instantânea
    books = books.filter(b => b.id !== id);
    localStorage.setItem("books_backup", JSON.stringify(books));

    showToast('🗑️ Livro removido.', 'success');
    renderTable();

    // 2. Sincronização em segundo plano
    fetch(`http://localhost:3000/livros/${id}`, {
      method: "DELETE"
    }).catch(e => console.warn("Erro ao deletar no back-end (segundo plano):", e));

  } catch (erro) {
    console.error("Erro ao deletar:", erro);
    showToast('❌ Erro ao deletar.', 'error');
  }
}

function editFirst() {
  if (books.length === 0) { showToast('Nenhum livro para editar.', 'error'); return; }
  openModal('edit', books[0].id);
}

function removeFirst() {
  if (books.length === 0) { showToast('Nenhum livro para remover.', 'error'); return; }
  deleteBook(books[0].id);
}

function focusSearch() {
  document.getElementById('searchInput').focus();
  document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
}

let toastTimer;
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.classList.remove('show'); }, 3000);
}

// animações
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// scroll suave
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ESC fecha modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// 🔥 INICIAR SISTEMA
window.onload = carregarLivros;