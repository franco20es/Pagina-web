document.addEventListener('DOMContentLoaded', () => {
  // Fallback para lazy loading si no hay soporte
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if (!('IntersectionObserver' in window)) {
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  }
});