const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Configurar multer para manejar el almacenamiento de archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para el archivo HTML principal
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'muestra.html'));
});

// Ruta para manejar el envío del formulario y la imagen
app.post('/upload', upload.single('imagen'), (req, res) => {
  const nombre = req.body.nombre;
  const imagen = req.file;

  // Verificar si se ha enviado una imagen
  if (!imagen) {
    return res.status(400).json({ error: 'Debe seleccionar una imagen' });
  }

  // Obtener los datos de la imagen en base64 para mostrarla en el cliente
  const imageData = `data:${imagen.mimetype};base64,${imagen.buffer.toString('base64')}`;

  // Devolver el nombre y la imagen en formato JSON
  res.json({ nombre, imageUrl: imageData });

  // Emitir la imagen al cliente a través de Socket.IO
  io.emit('chat message', { nombre, imageUrl: imageData });
});

// Escuchar la conexión de Socket.IO
io.on('connection', function(socket) {
  console.log('Usuario Conectado');

  // Escuchar el evento 'chat message' para los mensajes de chat
  socket.on('chat message', function(data) {
    console.log('Mensaje del chat:', data.nombre, data.mensaje);
    io.emit('chat message', { imagen: data.imagen, nombre: data.nombre, mensaje: data.mensaje }); // Emitir el mensaje a todos los clientes
  });

  // Escuchar la desconexión del usuario
  socket.on('disconnect', function() {
    console.log('Usuario desconectado');
  });
});

// Iniciar el servidor HTTP en el puerto 3000
const PORT = 3000;
http.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
