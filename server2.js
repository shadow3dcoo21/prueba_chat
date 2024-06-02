// Importar las dependencias
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);



// Configuración de multer para manejar archivos de imagen en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configurar bodyParser para manejar datos de formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Ruta para el archivo HTML principal
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/mensaje.html');
});

// Ruta para manejar el envío del formulario
app.post('/upload', upload.single('imagen'), (req, res) => {
    const nombre = req.body.nombre;
    const imagen = req.file;

    if (!imagen) {
        return res.status(400).send('No se envió ninguna imagen.');
    }

    // Procesar la imagen en memoria
    const imageUrl = `data:${imagen.mimetype};base64,${imagen.buffer.toString('base64')}`;

    // Devolver la URL de la imagen en formato JSON
    res.json({ nombre, imageUrl });
});


// Escuchar la conexión de Socket.IO
io.on('connection', function(socket) {
    console.log('Usuario Conectado');

    // Escuchar el evento 'registroUsuario' para el registro de usuarios
    socket.on('registroUsuario', function(data) {
        console.log('Usuario registrado:', data.nombre);
        socket.nombreUsuario = data.nombre; // Guardar el nombre de usuario en el objeto socket

        // Emitir un evento personalizado para enviar el nombre de usuario al cliente
        socket.emit('nombreUsuario', { nombre: socket.nombreUsuario });
    });

    // Escuchar el evento 'chat message' para los mensajes de chat
    socket.on('chat message', function(data) {
        console.log('Mensaje del chat:', data.nombre, data.mensaje);
        io.emit('chat message', { nombre: data.nombre, mensaje: data.mensaje }); // Emitir el mensaje a todos los clientes
    });

    // Escuchar la desconexión del usuario
    socket.on('disconnect', function() {
        console.log('Usuario desconectado');
    });
});

// Iniciar el servidor HTTP en el puerto 3000
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
