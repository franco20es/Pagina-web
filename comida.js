document.addEventListener('DOMContentLoaded', () => {
  // === Funciones para guardar y mostrar comidas dinámicas ===
  function obtenerComidasGuardadas() {
    return JSON.parse(localStorage.getItem('comidas')) || [];
  }

  function guardarComidas(comidas) {
    localStorage.setItem('comidas', JSON.stringify(comidas));
  }

  function renderizarComidas() {
    const grid = document.querySelector('.comida-grid');
    if (!grid) return;
    grid.querySelectorAll('.comida-card[data-dinamico="true"]').forEach(card => card.remove());
    const comidas = obtenerComidasGuardadas();
    comidas.forEach(({ nombre, precio, imagen }, idx) => {
      const nuevo = document.createElement('article');
      nuevo.className = 'comida-card';
      nuevo.setAttribute('data-dinamico', 'true');
      nuevo.innerHTML = `
        <img src="${imagen}" alt="${nombre}" loading="lazy">
        <div class="card-content">
          <h3>${nombre}</h3>
          <p>Plato agregado por el administrador.</p>
          <p class="price">S/${precio}</p>
          <button class="btn-comprar" aria-label="Ordenar ${nombre}">Comprar</button>
          <button class="btn-eliminar-comida" data-idx="${idx}" style="margin-top:8px;background:#e74c3c;color:#fff;border:none;padding:6px 12px;cursor:pointer;">Eliminar</button>
        </div>
      `;
      grid.appendChild(nuevo);
    });
    document.querySelectorAll('.btn-eliminar-comida').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = parseInt(this.getAttribute('data-idx'));
        const comidas = obtenerComidasGuardadas();
        comidas.splice(idx, 1);
        guardarComidas(comidas);
        renderizarComidas();
      });
    });
  }

  renderizarComidas();

  let agregarComidaBtn = document.getElementById('agregar-comida');
  if (!agregarComidaBtn) {
    agregarComidaBtn = document.createElement('button');
    agregarComidaBtn.id = 'agregar-comida';
    agregarComidaBtn.type = 'button';
    agregarComidaBtn.textContent = 'Agregar nueva comida';
    const comidaGrid = document.querySelector('.comida-grid');
    if (comidaGrid) comidaGrid.parentNode.insertBefore(agregarComidaBtn, comidaGrid);
  }

  const form = document.createElement('form');
  form.id = 'form-nueva-comida';
  form.innerHTML = `
    <input type="text" id="nombre-comida" placeholder="Nombre del plato" required>
    <input type="number" id="precio-comida" placeholder="Precio (S/)" min="1" required>
    <input type="url" id="imagen-comida" placeholder="URL de la imagen" required>
    <button type="submit">Agregar</button>
    <button type="button" id="cancelar-comida">Cancelar</button>
  `;
  form.style.display = 'none';
  agregarComidaBtn.parentNode.insertBefore(form, agregarComidaBtn.nextSibling);

  agregarComidaBtn.addEventListener('click', () => {
    form.style.display = 'block';
    agregarComidaBtn.style.display = 'none';
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre-comida').value.trim();
    const precio = document.getElementById('precio-comida').value.trim();
    const imagen = document.getElementById('imagen-comida').value.trim();
    if (!nombre || !precio || !imagen) return;
    const comidas = obtenerComidasGuardadas();
    comidas.push({ nombre, precio, imagen });
    guardarComidas(comidas);
    renderizarComidas();
    form.reset();
    form.style.display = 'none';
    agregarComidaBtn.style.display = 'inline-block';
  });

  form.querySelector('#cancelar-comida').addEventListener('click', function() {
    form.reset();
    form.style.display = 'none';
    agregarComidaBtn.style.display = 'inline-block';
  });
});