// Clase Carrito: núcleo de negocio. No toca el DOM.
export class Carrito {
  /**
   * @param {Array<{sku:string,title:string,price:number}>} catalogo
   * @param {string} currency
   */
  constructor(catalogo = [], currency = "€") {
    /** @type {Map<string, {sku:string,title:string,price:number,quantity:number}>} */
    this.lineas = new Map();
    this.currency = currency;
    if (catalogo.length) this.cargarCatalogo(catalogo);
  }

  /**
   * Carga/actualiza el catálogo. Resetea cantidades a 0 si no hay persistencia previa.
   */
  cargarCatalogo(catalogo) {
    for (const p of catalogo) {
      const sku = p.sku;
      const prev = this.lineas.get(sku);
      const quantity = prev ? prev.quantity : 0;
      this.lineas.set(sku, { sku, title: p.title, price: p.price, quantity });
    }
  }

  /**
   * Actualiza el número de unidades de un producto (no negativas).
   * @param {string} sku
   * @param {number} unidades
   */
  actualizarUnidades(sku, unidades) {
    const linea = this.lineas.get(sku);
    if (!linea) return;
    const q = Number.isFinite(unidades) ? Math.max(0, Math.trunc(unidades)) : 0;
    linea.quantity = q;
  }

  /**
   * Devuelve datos esenciales de un producto + unidades seleccionadas.
   * @param {string} sku
   * @returns {{sku:string, quantity:number} | null}
   */
  obtenerInformacionProducto(sku) {
    const linea = this.lineas.get(sku);
    if (!linea) return null;
    return { sku: linea.sku, quantity: linea.quantity };
  }

  /**
   * Devuelve un resumen del carrito con total, moneda y productos seleccionados.
   */
  obtenerCarrito() {
    const productos = Array.from(this.lineas.values()).filter(l => l.quantity > 0);
    const total = productos.reduce((acc, l) => acc + l.price * l.quantity, 0);
    return {
      total: total.toFixed(2),
      currency: this.currency,
      products: productos.map(l => ({
        sku: l.sku,
        title: l.title,
        price: l.price,
        quantity: l.quantity,
        lineTotal: Number((l.price * l.quantity).toFixed(2))
      }))
    };
  }

  /**
   * Serializa estado (para localStorage).
   */
  toJSON() {
    return JSON.stringify({
      currency: this.currency,
      lines: Array.from(this.lineas.values())
    });
  }

  /**
   * Restaura estado desde JSON (si coincide el catálogo, respeta títulos y precios).
   * @param {string} json
   */
  fromJSON(json) {
    try {
      const obj = JSON.parse(json);
      if (!obj || !Array.isArray(obj.lines)) return;
      this.currency = obj.currency ?? this.currency;
      for (const l of obj.lines) {
        if (this.lineas.has(l.sku)) {
          const actual = this.lineas.get(l.sku);
          this.lineas.set(l.sku, { ...actual, quantity: Math.max(0, Math.trunc(l.quantity || 0)) });
        }
      }
    } catch {}
  }
}
