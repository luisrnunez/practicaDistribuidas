const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

const db = new sqlite3.Database('./db.sqlite');

// Inicializar la base de datos
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS notas (id INTEGER PRIMARY KEY AUTOINCREMENT, contenido TEXT)");
});

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Endpoint para obtener todas las notas
app.get('/api/notas', (req, res) => {
  db.all("SELECT * FROM notas", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Endpoint para agregar una nueva nota
app.post('/api/notas', (req, res) => {
  const { contenido } = req.body;
  db.run("INSERT INTO notas (contenido) VALUES (?)", [contenido], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const newNote = { id: this.lastID, contenido };
    io.emit('newNote', newNote);  // Emitir un evento de nueva nota
    res.json(newNote);
  });
});

// Manejar las conexiones de WebSocket
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar el servidor
server.listen(port, '0.0.0.0', () => {
  console.log(`Servidor REST escuchando en http://localhost:${port}`);
});
