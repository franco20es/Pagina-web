document.addEventListener('DOMContentLoaded', () => {
  // === Funciones para guardar y mostrar transportes dinámicos ===
  function obtenerTransportesGuardados() {
    return JSON.parse(localStorage.getItem('transportes')) || [];
  }

  function guardarTransportes(transportes) {
    localStorage.setItem('transportes', JSON.stringify(transportes));
  }

  function renderizarTransportes() {
    const grid = document.querySelector('.transporte-grid');
    if (!grid) return;
    grid.querySelectorAll('.transporte-card[data-dinamico="true"]').forEach(card => card.remove());
    const transportes = obtenerTransportesGuardados();
    transportes.forEach(({ nombre, precio, imagen }, idx) => {
      const nuevo = document.createElement('article');
      nuevo.className = 'transporte-card';
      nuevo.setAttribute('data-dinamico', 'true');
      nuevo.innerHTML = `
        <img src="${imagen}" alt="${nombre}" loading="lazy">
        <div class="card-content">
          <h3>${nombre}</h3>
          <p>Nuevo servicio agregado.</p>
          <p class="price">S/${precio}</p>
          <button class="btn-comprar" aria-label="Comprar pasaje en ${nombre}">Comprar</button>
          <button class="btn-eliminar-transporte" data-idx="${idx}" style="margin-top:8px;background:#e74c3c;color:#fff;border:none;padding:6px 12px;cursor:pointer;">Eliminar</button>
        </div>
      `;
      grid.appendChild(nuevo);
    });
    document.querySelectorAll('.btn-eliminar-transporte').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = parseInt(this.getAttribute('data-idx'));
        const transportes = obtenerTransportesGuardados();
        transportes.splice(idx, 1);
        guardarTransportes(transportes);
        renderizarTransportes();
      });
    });
  }

  renderizarTransportes();

  const agregarTransporteBtn = document.getElementById('agregar-transporte');
  if (agregarTransporteBtn) {
    const form = document.createElement('form');
    form.id = 'form-nuevo-transporte';
    form.innerHTML = `
      <input type="text" id="nombre-transporte" placeholder="Nombre del transporte" required>
      <input type="number" id="precio-transporte" placeholder="Precio (S/)" min="1" required>
      <input type="url" id="imagen-transporte" placeholder="URL de la imagen" required>
      <button type="submit">Agregar</button>
      <button type="button" id="cancelar-transporte">Cancelar</button>
    `;
    form.style.display = 'none';
    agregarTransporteBtn.parentNode.insertBefore(form, agregarTransporteBtn.nextSibling);
    agregarTransporteBtn.addEventListener('click', () => {
      form.style.display = 'block';
      agregarTransporteBtn.style.display = 'none';
    });
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const nombre = document.getElementById('nombre-transporte').value.trim();
      const precio = document.getElementById('precio-transporte').value.trim();
      const imagen = document.getElementById('imagen-transporte').value.trim();
      if (!nombre || !precio || !imagen) return;
      const transportes = obtenerTransportesGuardados();
      transportes.push({ nombre, precio, imagen });
      guardarTransportes(transportes);
      renderizarTransportes();
      form.reset();
      form.style.display = 'none';
      agregarTransporteBtn.style.display = 'inline-block';
    });
    form.querySelector('#cancelar-transporte').addEventListener('click', function() {
      form.reset();
      form.style.display = 'none';
      agregarTransporteBtn.style.display = 'inline-block';
    });
  }
});