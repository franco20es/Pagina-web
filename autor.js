document.addEventListener('DOMContentLoaded', () => {
  // Redirección si ya está logueado y está en suscripcion.html
  if (window.location.pathname.includes('suscripcion.html') && localStorage.getItem('user')) {
    window.location.href = 'index.html';
  }

  // === Funciones de autenticación ===
  const isLoggedIn = () => !!localStorage.getItem('user');

  // Función para restringir botones de compra, reserva y comentarios
  const restrictActions = () => {
    const actionButtons = document.querySelectorAll('.btn-comprar, .btn-reservar, #abrir-modal-comentario');
    actionButtons.forEach(button => {
      if (!isLoggedIn()) {
        if (button.classList.contains('btn-comprar') || button.classList.contains('btn-reservar')) {
          button.disabled = true;
          button.title = 'Debes registrarte para realizar esta acción';
          button.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('redirectAfterLogin', button.getAttribute('href') || 'pago.html');
            alert('Por favor, regístrate para comprar o reservar.');
            window.location.href = 'suscripcion.html';
          });
        } else if (button.id === 'abrir-modal-comentario') {
          button.disabled = true;
          button.title = 'Debes iniciar sesión para agregar un comentario';
          button.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            alert('Por favor, inicia sesión para agregar un comentario.');
            window.location.href = 'login.html';
          });
        }
      } else {
        button.disabled = false;
        button.title = '';
      }
    });
  };

  // Función para ocultar/mostrar botones de agregar según el rol
  function OcultarBotonesDeAgregar() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.username === 'admin@gmail.com';

    const agregarTransporteBtn = document.getElementById('agregar-transporte');
    const agregarComidaBtn = document.getElementById('agregar-comida');
    const agregarHospedajeBtn = document.getElementById('agregar-hospedaje');
    const agregarComentarioBtn = document.getElementById('abrir-modal-comentario');
    const agregarPaqueteBtn = document.getElementById('agregar-paquete');

    if (agregarTransporteBtn) agregarTransporteBtn.style.display = 'none';
    if (agregarComidaBtn) agregarComidaBtn.style.display = 'none';
    if (agregarHospedajeBtn) agregarHospedajeBtn.style.display = 'none';
    if (agregarPaqueteBtn) agregarPaqueteBtn.style.display = 'none';

    if (isAdmin && isLoggedIn()) {
      if (agregarTransporteBtn) agregarTransporteBtn.style.display = 'block';
      if (agregarComidaBtn) agregarComidaBtn.style.display = 'block';
      if (agregarHospedajeBtn) agregarHospedajeBtn.style.display = 'block';
      if (agregarComentarioBtn) agregarComentarioBtn.style.display = 'none';
      if (agregarPaqueteBtn) agregarPaqueteBtn.style.display = 'block';
    } else if (isLoggedIn()) {
      if (agregarComentarioBtn) agregarComentarioBtn.style.display = 'block';
    }
  }

  // Manejo del menú de navegación para inicio/cerrar sesión
  const navList = document.querySelector('.navbar ul');
  if (navList) {
    // Elimina cualquier botón de sesión anterior
    navList.querySelectorAll('.login-logout-item').forEach(item => item.remove());

    const user = localStorage.getItem('user');
    const logoutItem = document.createElement('li');
    logoutItem.className = 'login-logout-item';
    logoutItem.innerHTML = user
      ? `<a href="#" id="logout">Cerrar Sesión (${JSON.parse(user).username})</a>`
      : `<a href="login.html">Iniciar Sesión</a>`;
    navList.appendChild(logoutItem);

    const logoutLink = document.getElementById('logout');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        localStorage.removeItem('redirectAfterLogin');
        alert('Sesión cerrada.');
        window.location.href = 'index.html';
      });
    }
  }

  // Ejecutar funciones al cargar la página
  restrictActions();
  OcultarBotonesDeAgregar();
});