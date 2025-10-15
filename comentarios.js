document.addEventListener('DOMContentLoaded', () => {
  // === Comentarios dinámicos con modal ===
  function obtenerComentariosGuardados() {
    return JSON.parse(localStorage.getItem('comentarios')) || [];
  }

  function guardarComentarios(comentarios) {
    localStorage.setItem('comentarios', JSON.stringify(comentarios));
  }

  function renderizarComentarios() {
    const contenedor = document.getElementById('nuevos-comentarios');
    if (!contenedor) return;
    contenedor.innerHTML = '';
    const comentarios = obtenerComentariosGuardados();
    comentarios.forEach(({ nombre, comentario, imagen }, idx) => {
      const block = document.createElement('blockquote');
      block.className = 'testimonio';
      block.innerHTML = `
        <img src="${imagen ? imagen : 'imagenes/paracas.png'}" alt="Foto de ${nombre}" loading="lazy">
        <div class="testimonio-content">
          <p>"${comentario}"</p>
          <footer>- ${nombre}</footer>
          <button class="btn-eliminar-comentario" data-idx="${idx}" style="margin-top:8px;background:#e74c3c;color:#fff;border:none;padding:6px 12px;cursor:pointer;">Eliminar</button>
        </div>
      `;
      contenedor.appendChild(block);
    });
    document.querySelectorAll('.btn-eliminar-comentario').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = parseInt(this.getAttribute('data-idx'));
        const comentarios = obtenerComentariosGuardados();
        comentarios.splice(idx, 1);
        guardarComentarios(comentarios);
        renderizarComentarios();
      });
    });
  }

  renderizarComentarios();

  const abrirBtn = document.getElementById('abrir-modal-comentario');
  const modal = document.getElementById('modal-comentario');
  const cerrarBtn = document.getElementById('cerrar-modal-comentario');
  const form = document.getElementById('comentario-form-modal');
  if (abrirBtn && modal && cerrarBtn && form) {
    abrirBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
    cerrarBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      form.reset();
    });
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        form.reset();
      }
    });
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const nombre = document.getElementById('nombre-modal').value.trim();
      const comentario = document.getElementById('comentario-modal').value.trim();
      const imagen = document.getElementById('imagen-modal').value.trim();
      if (!nombre || !comentario) return;
      const comentarios = obtenerComentariosGuardados();
      comentarios.push({ nombre, comentario, imagen });
      guardarComentarios(comentarios);
      renderizarComentarios();
      modal.style.display = 'none';
      form.reset();
    });
  }

  // === Comentarios con estrellas ===
  const commentForm = document.getElementById('comentario-form');
  const commentsContainer = document.getElementById('nuevos-comentarios');
  const ratingStars = document.querySelectorAll('.star');
  const ratingInput = document.getElementById('rating-value');

  if (ratingStars && ratingInput) {
    ratingStars.forEach(star => {
      star.addEventListener('click', () => {
        const value = star.getAttribute('data-value');
        ratingInput.value = value;
        ratingStars.forEach(s => s.classList.toggle('active', s.getAttribute('data-value') <= value));
      });
    });
  }

  if (commentForm && commentsContainer && ratingInput) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('nombre').value.trim();
      const comment = document.getElementById('comentario').value.trim();
      const rating = ratingInput.value;

      if (!name || !comment || rating === '0') {
        alert('Por favor, completa todos los campos y selecciona una calificación.');
        return;
      }

      const newComment = document.createElement('blockquote');
      newComment.classList.add('testimonio');
      newComment.innerHTML = `
        <img src="https://via.placeholder.com/80" alt="Foto de ${name}" loading="lazy">
        <div class="testimonio-content">
          <p>"${comment}"</p>
          <footer>- ${name} (${'★'.repeat(rating)})</footer>
        </div>
      `;

      commentsContainer.appendChild(newComment);
      commentForm.reset();
      ratingStars.forEach(star => star.classList.remove('active'));
      ratingInput.value = '0';
      toggleForm();
    });
  }
});

// Función global
window.toggleForm = function () {
  const form = document.getElementById('form-comentario');
  const button = document.querySelector('.btn-toggle');
  if (form && button) {
    form.classList.toggle('form-hidden');
    const isExpanded = !form.classList.contains('form-hidden');
    button.setAttribute('aria-expanded', isExpanded);
    button.textContent = isExpanded ? 'Ocultar Formulario' : 'Agregar Comentario';
  }
};