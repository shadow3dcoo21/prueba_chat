//importar las dependencias
const express=require('express');
const app=express();
const http=require('http').Server(app);
const io=require('socket.io')(http);


// Ruta para el archivo HTML principal
app.get('/', function(req, res) {
    res.sendFile(__dirname +'/index.html');
});

// Ruta para el archivo HTML principal
app.get('/usuario1', function(req, res) {
    res.sendFile(__dirname +'/usuario1.html');
});

// Ruta para el archivo HTML principal
app.get('/usuario2', function(req, res) {
    res.sendFile(__dirname +'/usuario2.html');
});


//Escuchar la coexion de Socker.IO
io.on('connection',function(socket){
    console.log('Usuario Conectado');

    //Escuchar el evento 'chat message 1'♥ para el chat 1
    socket.on('chat message 1',function(msg){
        console.log('Mensaje del chat 1: '+ msg);
        io.emit('chat message 1',msg);
    });
    
    //Escuchar el evento 'chat message 2'♥ para el chat 2
    socket.on('chat message 2',function(msg){
        console.log('Mensaje del chat 2: '+ msg);
        io.emit('chat message 2',msg);
    });

    //Escuchar la desconexion del usuario
    socket.on('disconnect',function(){
        console.log('Usuario desconectado');
    });

});

//iniciar el servidor http en el puerto 3000

http.listen(3000,function(){
    console.log("servidor conectado");
});