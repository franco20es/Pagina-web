document.addEventListener('DOMContentLoaded', () => {
  // ...otros códigos...

  // BLOQUE PARA AGREGAR PAQUETE DINÁMICO
  const agregarPaqueteBtn = document.getElementById('agregar-paquete');
  if (agregarPaqueteBtn) {
    // Evita duplicar el formulario
    if (!document.getElementById('form-nuevo-paquete')) {
      const formPaquete = document.createElement('form');
      formPaquete.id = 'form-nuevo-paquete';
      formPaquete.innerHTML = `
        <input type="text" id="nombre-paquete" placeholder="Nombre del paquete" required>
        <input type="number" id="precio-paquete" placeholder="Precio (S/)" min="1" required>
        <input type="url" id="imagen-paquete" placeholder="URL de la imagen" required>
        <button type="submit">Agregar</button>
        <button type="button" id="cancelar-paquete">Cancelar</button>
      `;
      formPaquete.style.display = 'none';
      agregarPaqueteBtn.parentNode.insertBefore(formPaquete, agregarPaqueteBtn.nextSibling);

      agregarPaqueteBtn.addEventListener('click', () => {
        formPaquete.style.display = 'block';
        agregarPaqueteBtn.style.display = 'none';
      });

      formPaquete.addEventListener('submit', function (e) {
        e.preventDefault();
        const nombre = document.getElementById('nombre-paquete').value.trim();
        const precio = document.getElementById('precio-paquete').value.trim();
        const imagen = document.getElementById('imagen-paquete').value.trim();
        if (!nombre || !precio || !imagen) return;
        // Guardar en localStorage
        const paquetes = JSON.parse(localStorage.getItem('paquetes')) || [];
        paquetes.push({ nombre, precio, imagen });
        localStorage.setItem('paquetes', JSON.stringify(paquetes));
        // Renderizar los paquetes (debes tener una función renderizarPaquetes)
        if (typeof renderizarPaquetes === 'function') renderizarPaquetes();
        formPaquete.reset();
        formPaquete.style.display = 'none';
        agregarPaqueteBtn.style.display = 'inline-block';
      });

      formPaquete.querySelector('#cancelar-paquete').addEventListener('click', function () {
        formPaquete.reset();
        formPaquete.style.display = 'none';
        agregarPaqueteBtn.style.display = 'inline-block';
      });
    }
  }

  // ...otros códigos...
});

function renderizarPaquetes() {
  const slider = document.querySelector('.slider-container');
  if (!slider) return;

  // Elimina solo los paquetes agregados dinámicamente
  slider.querySelectorAll('.slide[data-dinamico="true"]').forEach(card => card.remove());

  // Obtiene los paquetes guardados
  const paquetes = JSON.parse(localStorage.getItem('paquetes')) || [];

  paquetes.forEach(({ nombre, precio, imagen }, idx) => {
    const nuevo = document.createElement('article');
    nuevo.className = 'slide';
    nuevo.setAttribute('data-dinamico', 'true');
    nuevo.innerHTML = `
      <img src="${imagen}" alt="${nombre}" loading="lazy">
      <div class="texto">
        <h3>${nombre}</h3>
        <p>Paquete agregado por el administrador.</p>
        <p class="price">S/${precio}</p>
        <a href="#" class="btn-paquete" data-nombre="${nombre}" data-precio="${precio}" data-imagen="${imagen}">Comprar Paquete</a>
        <button class="btn-eliminar-paquete" data-idx="${idx}" style="margin-top:8px;background:#e74c3c;color:#fff;border:none;padding:6px 12px;cursor:pointer;">Eliminar</button>
      </div>
    `;
    slider.appendChild(nuevo);
  });

  // Evento para eliminar paquete
  document.querySelectorAll('.btn-eliminar-paquete').forEach(btn => {
    btn.addEventListener('click', function () {
      const idx = parseInt(this.getAttribute('data-idx'));
      const paquetes = JSON.parse(localStorage.getItem('paquetes')) || [];
      paquetes.splice(idx, 1);
      localStorage.setItem('paquetes', JSON.stringify(paquetes));
      renderizarPaquetes();
    });
  });

  // Evento para agregar al carrito
  document.querySelectorAll('.btn-paquete').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const nombre = btn.getAttribute('data-nombre');
      const precio = btn.getAttribute('data-precio');
      const imagen = btn.getAttribute('data-imagen');
      let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      carrito.push({ nombre, precio, imagen, cantidad: 1 });
      localStorage.setItem('carrito', JSON.stringify(carrito));
      alert('Paquete agregado al carrito');
    });
  });
 // === DESPLAZA EL SLIDER AL ÚLTIMO PAQUETE ===
  // Busca todos los slides
 // const slides = slider.querySelectorAll('.slide');
  //const lastIndex = slides.length - 1;
  // Si usas transform para mover el slider:
  //slider.style.transform = `translateX(-${lastIndex * 100}%)`;
  // Si tienes una variable global para el índice actual, actualízala:
  //window.currentSlide = lastIndex;


// Llama a la función al cargar la página
document.addEventListener('DOMContentLoaded', renderizarPaquetes);
}