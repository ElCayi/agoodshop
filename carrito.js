// Clase Carrito: lógica de negocio. No toca el DOM
export class Carrito {
  constructor(catalogo = [], currency = "€") {
    this.lineas = new Map();   
    this.currency = currency;
    if (catalogo.length) this.cargarCatalogo(catalogo);
  }

  // Carga/actualiza el catálogo (mantiene cantidades si ya existían)
  cargarCatalogo(catalogo) {
    for (const p of catalogo) {
      const sku = p.sku;
      const prev = this.lineas.get(sku);
      const quantity = prev ? prev.quantity : 0;
      this.lineas.set(sku, { sku, title: p.title, price: p.price, quantity });
    }
  }

  // Cambia unidades (siempre entero >= 0)
  actualizarUnidades(sku, unidades) {
    const linea = this.lineas.get(sku);
    if (!linea) return;
    const q = Number.isFinite(unidades) ? Math.max(0, Math.trunc(unidades)) : 0;
    linea.quantity = q;
  }

  // Info mínima de un producto en el carrito
  obtenerInformacionProducto(sku) {
    const linea = this.lineas.get(sku);
    if (!linea) return null;
    return { sku: linea.sku, quantity: linea.quantity };
  }

  // Resumen del carrito (total + líneas con quantity > 0)
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

  // Serializa el estado (para localStorage)
  toJSON() {
    return JSON.stringify({
      currency: this.currency,
      lines: Array.from(this.lineas.values())
    });
  }

  // Restaura el estado desde JSON (si el SKU existe en el catálogo actual)
  fromJSON(json) {
    try {
      const obj = JSON.parse(json);
      if (!obj || !Array.isArray(obj.lines)) return;
      this.currency = obj.currency ?? this.currency;
      for (const l of obj.lines) {
        if (this.lineas.has(l.sku)) {
          const actual = this.lineas.get(l.sku);
          this.lineas.set(l.sku, {
            ...actual,
            quantity: Math.max(0, Math.trunc(l.quantity || 0))
          });
        }
      }
    } catch {
      // Silenciar errores de parseo
    }
  }
}
