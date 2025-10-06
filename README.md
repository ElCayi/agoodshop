# aGoodShop · Actividad 1 (Carrito)

## Qué pide el profe (resumen)
- Clase **Carrito** (POO) como núcleo **sin tocar el DOM**.
- Cargar productos desde una **API JSON** (puedes usar jsonblob.com).
- **DOM**: crear listado de productos, escuchar cambios de unidades y **actualizar TOTAL** en vivo.
- Entrega: zip del proyecto + repo público.

## Estructura
```
.
├─ index.html
├─ styles.css
├─ app.js         # DOM + fetch + eventos + localStorage
└─ carrito.js     # Lógica del carrito (total, unidades, etc.)
```

## Paso a paso

1. Abre **api.example.json**, cópialo y crea un JSON en **https://jsonblob.com** → Save.
2. Copia la URL de la API (será algo como `https://jsonblob.com/api/xxxx`).  
3. En **app.js**, pega la URL en `API_URL`.
4. Abre `index.html` en tu navegador y prueba el carrito.
5. (Opcional) El estado se guarda en **localStorage**; botón "Vaciar carrito" limpia cantidades.
6. Usa "Ver JSON carrito" para ver el objeto que devolverías al backend.

## Notas técnicas
- El JSON de ejemplo usa `SKU` (mayúsculas). En el front lo normalizamos a `sku`.
- `price` viene como **string** → lo convertimos a `number`.
- La clase **Carrito** expone:
  - `actualizarUnidades(sku, unidades)`
  - `obtenerInformacionProducto(sku)` → `{ sku, quantity }`
  - `obtenerCarrito()` → `{ total, currency, products: [{ sku, title, price, quantity, lineTotal }] }`
- Persistencia voluntaria con `localStorage` (`toJSON`/`fromJSON`).

¡Listo para entregar y pulir según las indicaciones del profe!
