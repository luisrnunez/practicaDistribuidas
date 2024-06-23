const express = require('express');
const app = express();
const port = 3000;

const productos = {
  "1": { nombre: "Colita", precio: 10.0, descripcion: "Descripción" },
  "2": { nombre: "Pancito", precio: 20.0, descripcion: "Descripción" }
};

app.use(express.json());

// Endpoint para consultar un producto por ID
app.get('/api/productos/:id', (req, res) => {
  const producto = productos[req.params.id];
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

app.listen(port, () => {
  console.log(`Servidor REST escuchando en http://localhost:${port}`);
});

