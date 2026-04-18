let slideIndices = {};

// Inicializa un carrusel dado su containerId
function initSlideshow(containerId) {
  slideIndices[containerId] = 1;
  showSlides(1, containerId);
}

// Cambia slides adelante/atrás para un carrusel específico
function plusSlides(n, containerId) {
  // Si no está inicializado, inicializa primero
  if (slideIndices[containerId] === undefined) {
    initSlideshow(containerId);
    return;
  }
  showSlides(slideIndices[containerId] + n, containerId);
}

// Cambia a una slide específica para un carrusel específico
function currentSlide(n, containerId) {
  showSlides(n, containerId);
}

// Muestra la slide correspondiente en el carrusel indicado
function showSlides(n, containerId) {
  let i;
  const container = document.getElementById(containerId);
  if (!container) return;
  const slides = container.getElementsByClassName("mySlides");
  const dots = container.getElementsByClassName("demo");
  const captionText = container.querySelector("#caption");
  if (slides.length === 0) return;

  // Si el carrusel no está inicializado, inicialízalo
  if (slideIndices[containerId] === undefined) {
    initSlideshow(containerId);
    return;
  }

  // Ajustar el índice antes de usarlo
  let idx = n;
  if (idx > slides.length) { idx = 1; }
  if (idx < 1) { idx = slides.length; }
  slideIndices[containerId] = idx;

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[idx - 1].style.display = "block";
  if (dots.length > 0) {
    dots[idx - 1].className += " active";
  }
  if (captionText && dots.length > 0) {
    captionText.innerHTML = dots[idx - 1].alt;
  }
}
