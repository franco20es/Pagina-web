document.addEventListener('DOMContentLoaded', () => {
  // === Funciones para guardar y mostrar paquetes dinámicos ===
  function obtenerPaquetesGuardados() {
    return JSON.parse(localStorage.getItem('paquetes')) || [];
  }

  function guardarPaquetes(paquetes) {
    localStorage.setItem('paquetes', JSON.stringify(paquetes));
  }

 function renderizarPaquetes() {
  const sliderContainer = document.querySelector('.slider-container');
  if (!sliderContainer) return;
  // Elimina solo los paquetes agregados dinámicamente
  sliderContainer.querySelectorAll('.slide[data-dinamico="true"]').forEach(slide => slide.remove());

  const paquetes = obtenerPaquetesGuardados();
  paquetes.forEach(({ nombre, descripcion, precio, imagen }, idx) => {
    const nuevoSlide = document.createElement('article');
    nuevoSlide.className = 'slide';
    nuevoSlide.setAttribute('data-dinamico', 'true');
    nuevoSlide.setAttribute('aria-labelledby', `${nombre.toLowerCase().replace(/\s/g, '-')}-heading`);
    nuevoSlide.innerHTML = `
      <img src="${imagen}" alt="Vista de ${nombre}" loading="lazy">
      <div class="texto">
        <h3 id="${nombre.toLowerCase().replace(/\s/g, '-')}-heading">${nombre}</h3>
        <p>${descripcion}</p>
        <p class="price">S/${precio}</p>
        <a href="#" class="btn-paquete">Comprar Paquete</a>
        <button class="btn-eliminar-paquete" data-idx="${idx}" style="margin-top:8px;background:#e74c3c;color:#fff;border:none;padding:6px 12px;cursor:pointer;">Eliminar</button>
      </div>
    `;
    sliderContainer.appendChild(nuevoSlide);
  });

  // Evento para eliminar paquete
  document.querySelectorAll('.btn-eliminar-paquete').forEach(btn => {
    btn.addEventListener('click', function () {
      const idx = parseInt(this.getAttribute('data-idx'));
      const paquetes = obtenerPaquetesGuardados();
      paquetes.splice(idx, 1);
      guardarPaquetes(paquetes);
      renderizarPaquetes();
    });
  });

    // Reasignar eventos del slider después de agregar nuevos slides
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    const updateSlider = () => {
      if (sliderContainer) {
        sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
      }
    };

    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');
    if (nextButton && prevButton) {
      nextButton.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
      });

      prevButton.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
      });
    }
  }

  // Renderizar paquetes guardados al cargar la página
  renderizarPaquetes();

  // Agregar nuevo paquete
  const agregarPaqueteBtn = document.getElementById('agregar-paquete');
  if (agregarPaqueteBtn) {
    const form = document.createElement('form');
    form.id = 'form-nuevo-paquete';
    form.innerHTML = `
      <input type="text" id="nombre-paquete" placeholder="Nombre del paquete" required>
      <input type="text" id="descripcion-paquete" placeholder="Descripción" required>
      <input type="number" id="precio-paquete" placeholder="Precio (S/)" min="1" required>
      <input type="url" id="imagen-paquete" placeholder="URL de la imagen" required>
      <button type="submit">Agregar</button>
      <button type="button" id="cancelar-paquete">Cancelar</button>
    `;
    form.style.display = 'none';
    agregarPaqueteBtn.parentNode.insertBefore(form, agregarPaqueteBtn.nextSibling);

    agregarPaqueteBtn.addEventListener('click', () => {
      form.style.display = 'block';
      agregarPaqueteBtn.style.display = 'none';
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const nombre = document.getElementById('nombre-paquete').value.trim();
      const descripcion = document.getElementById('descripcion-paquete').value.trim();
      const precio = document.getElementById('precio-paquete').value.trim();
      const imagen = document.getElementById('imagen-paquete').value.trim();
      if (!nombre || !descripcion || !precio || !imagen) return;

      const paquetes = obtenerPaquetesGuardados();
      paquetes.push({ nombre, descripcion, precio, imagen });
      guardarPaquetes(paquetes);

      renderizarPaquetes();

      form.reset();
      form.style.display = 'none';
      agregarPaqueteBtn.style.display = 'inline-block';
    });

    form.querySelector('#cancelar-paquete').addEventListener('click', function() {
      form.reset();
      form.style.display = 'none';
      agregarPaqueteBtn.style.display = 'inline-block';
    });
  }
});