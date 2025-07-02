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
      .replace(/\b(de|con)\b/g, '-') // reemplaza 'de' y 'con' por guion
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/-+/g, '-') // evita guiones dobles
      .replace(/^-+|-+$/g, ''); // elimina guiones al inicio/final
  }

  // Plantilla de producto
  function crearProductoCard(producto, categoriaKey) {
    const keyNorm = normalizar(categoriaKey);
    const nombreNorm = normalizar(producto.nombre);
    const path = `assets/images/productos/${keyNorm}/${nombreNorm}.png`;
    const wsNumero = '51907298740';
    const wsMensaje = encodeURIComponent(`Hola, quiero pedir: ${producto.nombre}`);
    const wsLink = `https://wa.me/${wsNumero}?text=${wsMensaje}`;
    return `
    <li>
      <div class="product-card">
        <figure class="card-banner">
          <img src="${path}" width="189" height="189" loading="lazy" alt="${producto.nombre}">
          <div class="btn-wrapper">
            <a href="${wsLink}" target="_blank" rel="noopener" class="product-btn" aria-label="Pedir">
              <ion-icon name="heart-outline" role="img" class="md hydrated" aria-label="heart outline"></ion-icon>
              <div class="tooltip">Pedir</div>
            </a>
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