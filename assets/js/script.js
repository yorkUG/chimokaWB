'use strict';



/**
 * PRELOAD
 * 
 * loading will be end after document is loaded
 */

/*const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});
*/


/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * NAVBAR
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);



/**
 * HEADER & BACK TOP BTN
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * HERO SLIDER
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
}

const slideNext = function () {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }

  updateSliderPos();
}

heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }

  updateSliderPos();
}

heroSliderPrevBtn.addEventListener("click", slidePrev);

/**
 * auto slide
 */

let autoSlideInterval;

const autoSlide = function () {
  autoSlideInterval = setInterval(function () {
    //slideNext();
  }, 7000);
}

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
  clearInterval(autoSlideInterval);
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

window.addEventListener("load", autoSlide);



/**
 * PARALLAX EFFECT
 */

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {

  x = (event.clientX / window.innerWidth * 10) - 5;
  y = (event.clientY / window.innerHeight * 10) - 5;

  // reverse the number eg. 20 -> -20, -5 -> 5
  x = x - (x * 2);
  y = y - (y * 2);

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }

});

// Carga dinámica de productos según filtro/tab
(function () {
  const filtros = Array.from(document.querySelectorAll('.filter-btn'));
  const grid = document.getElementById('productos-grid');
  let productosData = {};
  let categorias = [];

  // Función para normalizar strings para rutas
  function normalizar(str) {
    return str
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // elimina tildes
      .replace(/ñ/g, 'n')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '');
  }

  // Plantilla de producto
  function crearProductoCard(producto, categoriaKey) {
    const keyNorm = normalizar(categoriaKey);
    const nombreNorm = normalizar(producto.nombre);
    const path = `assets/images/productos/${keyNorm}/${nombreNorm}.png`;
    return `
    <li>
      <div class="product-card">
        <figure class="card-banner">
          <img src="${path}" width="189" height="189" loading="lazy" alt="${producto.nombre}">
          <div class="btn-wrapper">
            <button class="product-btn" aria-label="Pedir">
              <ion-icon name="heart-outline" role="img" class="md hydrated" aria-label="heart outline"></ion-icon>
              <div class="tooltip">Pedir</div>
            </button>
          </div>
        </figure>
        <div class="desc-content">
          <h3 class="title-3">
            <a href="#" class="card-title">${producto.nombre}</a>
          </h3>
          <div class="price-wrapper">
            <data class="price" value="${producto.precio}">S/ ${producto.precio.toFixed(2)}</data>
          </div>
        </div>
        <p class="card-text label-1">
          ${producto.descripcion}
        </p>
      </div>
    </li>
    `;
  }

  // Cargar el JSON de productos
  fetch('assets/data.json')
    .then(res => res.json())
    .then(data => {
      productosData = data.menu.Rappi;
      categorias = Object.keys(productosData);
      mostrarCategoria(categorias[0]);
    });

  // Mostrar productos de una categoría
  function mostrarCategoria(cat) {
    grid.innerHTML = '';
    if (!productosData[cat]) return;
    productosData[cat].forEach(producto => {
      grid.innerHTML += crearProductoCard(producto, cat);
    });
    // Actualizar filtro activo
    filtros.forEach(f => f.classList.remove('active'));
    const idx = categorias.indexOf(cat);
    if (filtros[idx]) filtros[idx].classList.add('active');
  }

  // Asignar eventos a los filtros
  filtros.forEach((btn, idx) => {
    btn.addEventListener('click', function () {
      mostrarCategoria(categorias[idx]);
    });
  });
})();

// Inicialización general o utilidades globales (vacío por ahora)