document.addEventListener('DOMContentLoaded', () => {
  // === Funciones para guardar y mostrar hospedajes dinámicos ===
  function obtenerHospedajesGuardados() {
    return JSON.parse(localStorage.getItem('hospedajes')) || [];
  }

  function guardarHospedajes(hospedajes) {
    localStorage.setItem('hospedajes', JSON.stringify(hospedajes));
  }

  function renderizarHospedajes() {
    const grid = document.querySelector('.hospedaje-grid');
    if (!grid) return;
    grid.querySelectorAll('.hospedaje-card[data-dinamico="true"]').forEach(card => card.remove());
    const hospedajes = obtenerHospedajesGuardados();
    hospedajes.forEach(({ nombre, precio, imagen, descripcion }, idx) => {
      const nuevo = document.createElement('article');
      nuevo.className = 'hospedaje-card';
      nuevo.setAttribute('data-dinamico', 'true');
      nuevo.innerHTML = `
        <img src="${imagen}" alt="${nombre}" loading="lazy">
        <div class="card-content">
          <h3>${nombre}</h3>
          <p>${descripcion}</p>
          <p class="price">${precio}</p>
          <button class="btn-reservar" aria-label="Reservar en ${nombre}">Reservar</button>
          <button class="btn-eliminar-hospedaje" data-idx="${idx}" style="margin-top:8px;background:#e74c3c;color:#fff;border:none;padding:6px 12px;cursor:pointer;">Eliminar</button>
        </div>
      `;
      grid.appendChild(nuevo);
    });
    document.querySelectorAll('.btn-eliminar-hospedaje').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = parseInt(this.getAttribute('data-idx'));
        const hospedajes = obtenerHospedajesGuardados();
        hospedajes.splice(idx, 1);
        guardarHospedajes(hospedajes);
        renderizarHospedajes();
      });
    });
  }

  renderizarHospedajes();

  let agregarHospedajeBtn = document.getElementById('agregar-hospedaje');
  if (!agregarHospedajeBtn) {
    agregarHospedajeBtn = document.createElement('button');
    agregarHospedajeBtn.id = 'agregar-hospedaje';
    agregarHospedajeBtn.type = 'button';
    agregarHospedajeBtn.textContent = 'Agregar nuevo hospedaje';
    agregarHospedajeBtn.style.cssText = 'margin-left:auto;display:block;margin-bottom:16px;';
    const hospedajeGrid = document.querySelector('.hospedaje-grid');
    if (hospedajeGrid) hospedajeGrid.insertBefore(agregarHospedajeBtn, hospedajeGrid.firstChild);
  }

  const form = document.createElement('form');
  form.id = 'form-nuevo-hospedaje';
  form.innerHTML = `
    <input type="text" id="nombre-hospedaje" placeholder="Nombre del hospedaje" required>
    <input type="text" id="descripcion-hospedaje" placeholder="Descripción" required>
    <input type="text" id="precio-hospedaje" placeholder="Precio (ej: Desde S/100 por noche)" required>
    <input type="url" id="imagen-hospedaje" placeholder="URL de la imagen" required>
    <button type="submit">Agregar</button>
    <button type="button" id="cancelar-hospedaje">Cancelar</button>
  `;
  form.style.display = 'none';
  agregarHospedajeBtn.parentNode.insertBefore(form, agregarHospedajeBtn.nextSibling);

  agregarHospedajeBtn.addEventListener('click', () => {
    form.style.display = 'block';
    agregarHospedajeBtn.style.display = 'none';
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre-hospedaje').value.trim();
    const descripcion = document.getElementById('descripcion-hospedaje').value.trim();
    const precio = document.getElementById('precio-hospedaje').value.trim();
    const imagen = document.getElementById('imagen-hospedaje').value.trim();
    if (!nombre || !descripcion || !precio || !imagen) return;
    const hospedajes = obtenerHospedajesGuardados();
    hospedajes.push({ nombre, descripcion, precio, imagen });
    guardarHospedajes(hospedajes);
    renderizarHospedajes();
    form.reset();
    form.style.display = 'none';
    agregarHospedajeBtn.style.display = 'inline-block';
  });

  form.querySelector('#cancelar-hospedaje').addEventListener('click', function() {
    form.reset();
    form.style.display = 'none';
    agregarHospedajeBtn.style.display = 'inline-block';
  });
});