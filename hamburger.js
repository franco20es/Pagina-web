document.addEventListener('DOMContentLoaded', () => {
  // === Menú Hamburguesa ===
  const hamburger = document.getElementById('hamburger');
  const navbar = document.getElementById('navbar');

  if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
      navbar.classList.toggle('active');
      const isExpanded = navbar.classList.contains('active');
      hamburger.setAttribute('aria-expanded', isExpanded);

      const lines = hamburger.querySelectorAll('.line');
      if (isExpanded) {
        lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
      }
    });

    navbar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 740) {
          navbar.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
          const lines = hamburger.querySelectorAll('.line');
          lines[0].style.transform = 'none';
          lines[1].style.opacity = '1';
          lines[2].style.transform = 'none';
        }
      });
    });
  }
});