document.addEventListener('DOMContentLoaded', () => {
  const mainImage = document.querySelector('.gallery-main .main-image');
  const thumbnails = document.querySelectorAll('.gallery-thumbnails .thumbnail');
  let currentIndex = 0;
  const totalImages = thumbnails.length;

  // Array of image sources and alt texts
  const images = [
    { src: 'imagenes/huacachina.png', alt: 'Vista principal de Huacachina' },
    { src: 'imagenes/paracas.png', alt: 'Vista principal de Paracas' },
    { src: 'imagenes/nazca.png', alt: 'Vista principal de Nazca' }
  ];

  // Update main image
  function updateMainImage(index) {
    mainImage.setAttribute('src', images[index].src);
    mainImage.setAttribute('alt', images[index].alt);
    thumbnails.forEach((thumb, i) => thumb.classList.toggle('active', i === index));
  }

  // Handle thumbnail hover
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('mouseover', () => {
      currentIndex = index;
      updateMainImage(currentIndex);
    });
  });

  // Initial image
  updateMainImage(currentIndex);
});