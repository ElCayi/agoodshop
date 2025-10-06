import { Carrito } from './carrito.js';

// app.js
const API_URL = "https://mocki.io/v1/d8fb0939-4741-4fa2-9542-e87276329aa8";

// Selectores del DOM
const $list = document.getElementById('product-list');
const $total = document.getElementById('total');
const $btnClear = document.getElementById('btn-clear');

// Key para localStorage
const LS_KEY = 'agoodshop_cart_v1';

//Muestra número con 2 decimales y símbolo de moneda
function formatCurrency(num, currency) {
  const n = Number(num);
  const formatted = n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (currency.trim() === '€') return `${formatted} ${currency}`;
  return `${currency}${formatted}`;
}

// Carga catálogo desde la API
async function fetchCatalog() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('No se pudo cargar la API');
  const data = await res.json();
  const currency = (data.currency ?? '€').trim();
  const catalogo = (data.products ?? []).map(p => ({
    sku: (p.SKU ?? p.sku ?? '').toString(),
    title: p.title ?? '',
    price: Number(p.price)
  }));
  return { currency, catalogo };
}

// Renderiza el catálogo completo
function renderCatalog(carrito) {
  $list.innerHTML = '';
  const { products } = carrito.obtenerCarrito();
  const selected = new Map(products.map(p => [p.sku, p.quantity]));

  for (const linea of carrito.lineas.values()) {
    const quantity = selected.get(linea.sku) ?? 0;

    const card = document.createElement('article');
    card.className = 'product';
    card.innerHTML = `
      <div class="title">${linea.title}</div>
      <div class="price">${formatCurrency(linea.price, carrito.currency)}</div>
      <div class="controls">
        <button type="button" data-act="dec" data-sku="${linea.sku}">–</button>
        <input type="number" min="0" step="1" value="${quantity}" data-sku="${linea.sku}" aria-label="Unidades" />
        <button type="button" data-act="inc" data-sku="${linea.sku}">+</button>
      </div>
    `;
    $list.appendChild(card);
  }
}

// Actualiza el total en el DOM
function updateTotal(carrito) {
  const { total, currency } = carrito.obtenerCarrito();
  $total.textContent = formatCurrency(total, currency);
}

// Guarda el carrito en localStorage
function persist(carrito) {
  localStorage.setItem(LS_KEY, carrito.toJSON());
}

// Restaura el carrito desde localStorage
function restore(carrito) {
  const raw = localStorage.getItem(LS_KEY);
  if (raw) carrito.fromJSON(raw);
}

// Maneja todos los clicks de + / - con delegación
function handleClicks(ev, carrito) {
  const btn = ev.target.closest('button[data-act]');
  if (!btn) return;
  const sku = btn.dataset.sku;
  const current = carrito.obtenerInformacionProducto(sku)?.quantity ?? 0;
  const act = btn.dataset.act;
  const next = act === 'inc' ? current + 1 : Math.max(0, current - 1);
  carrito.actualizarUnidades(sku, next);
  
  // Refrescar el input correspondiente
  const input = $list.querySelector(`input[data-sku="${CSS.escape(sku)}"]`);
  if (input) input.value = String(next);
  updateTotal(carrito);
  persist(carrito);
}

// Maneja cambios en inputs numéricos
function handleInput(ev, carrito) {
  const input = ev.target.closest('input[type="number"][data-sku]');
  if (!input) return;
  const sku = input.dataset.sku;
  const unidades = Math.max(0, Math.trunc(Number(input.value) || 0));
  input.value = String(unidades);
  carrito.actualizarUnidades(sku, unidades);
  updateTotal(carrito);
  persist(carrito);
}

// Botón limpiar
function clearCart(carrito) {
  for (const key of carrito.lineas.keys()) carrito.actualizarUnidades(key, 0);
  updateTotal(carrito);
  persist(carrito);
  
  // Actualiza inputs
  $list.querySelectorAll('input[type="number"][data-sku]').forEach(i => i.value = "0");
}

// Arranque de la app
(async function main() {
  try {
    const { currency, catalogo } = await fetchCatalog();
    const carrito = new Carrito(catalogo, currency);
    restore(carrito);          // 1) restaura estado
    renderCatalog(carrito);    // 2) pinta catálogo
    updateTotal(carrito);      // 3) muestra total

    // Listeners
    $list.addEventListener('click', (e) => handleClicks(e, carrito));
    $list.addEventListener('input', (e) => handleInput(e, carrito));
    $btnClear.addEventListener('click', () => clearCart(carrito));

  } catch (err) {
    console.error(err);
    $list.innerHTML = `<p>Error cargando la API. Revisa <code>API_URL</code> en <code>app.js</code>.</p>`;
  }
})();

