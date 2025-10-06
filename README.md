# aGoodShop · Actividad 1

## Repositorio Remoto
git@github.com:ElCayi/agoodshop.git

## Descripción
Proyecto de la Actividad 1 del módulo Desarrollo Web en Entorno Cliente, centrado en implementar un carrito de compra con POO, manejo del DOM y consumo de una API externa.

## Estructura del proyecto
```
.
├─ index.html       # Maqueta básica y estructura visual
├─ styles.css       # Estilos mínimos para la interfaz
├─ app.js           # Lógica de interacción con el DOM y la API
└─ carrito.js       # Clase Carrito (POO) con cálculos y gestión de productos
```

## Funcionamiento
- Se obtienen los productos desde una API externa y se muestran dinámicamente en la página.  
- El usuario puede aumentar o disminuir las unidades de cada producto o vaciar el carrito.  
- El total se actualiza automáticamente según las unidades seleccionadas.  
- La aplicación no genera nuevas ventanas ni usa librerías externas; todo se gestiona desde el DOM.

## Cambios realizados 🚨🚨
El servicio **jsonblob.com** no funcionaba correctamente, por lo que se ha sustituido por **[Mocki.io](https://mocki.io/fake-json-api)** como servicio equivalente para simular la API de productos.

## Ejemplo de API utilizada
```json
{
  "currency": "€",
  "products": [
    { "SKU": "0K3QOSOV4V", "title": "iFhone 13 Pro", "price": "938.99" },
    { "SKU": "TGD5XORY1L", "title": "Cargador", "price": "49.99" },
    { "SKU": "IOKW9BQ9F3", "title": "Funda de piel", "price": "79.99" }
  ]
}
```

## Funcionamiento básico del código
- **`carrito.js`**: define la clase `Carrito`, responsable de almacenar productos, actualizar unidades y calcular el total.  
- **`app.js`**: obtiene los datos de la API, genera el listado de productos y gestiona los eventos del usuario en el DOM.


