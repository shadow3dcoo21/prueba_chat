src="/socket.io/socket.io.js"
var socket = io();

    //Aqui comienza con dentro de document.addEventListener
    //lo que hace es verificar si todo el doom cargo en la pagina actual
    document.addEventListener('DOMContentLoaded', function() {
      var nombreUsuario = null;
      var imagenFile = null;

      const form = document.getElementById('formImagen');//en form guardo una referencia de un form que tenga como id formimagen
      const resultado = document.getElementById('resultado');//igual aqui
      const mensajes=document.getElementById('formMensajes');

      form.addEventListener('submit', async (event) => {
        event.preventDefault();//evita que el formulario se envie , cuando se presiona enviar se ejcuta este evento , para que puedas
        //hacer lo que quieras con eso y lo envia sin que la pagina se recargue.


        const formData = new FormData(form);//aqui guarda los datos del formulario , los datos especificos que se van a enviar
        const response = await fetch('/upload', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();//convierte la respuesta del servidro json en javascript .
        console.log("esto es la prueba :"+data)
        resultado.innerHTML = `<p>Nombre: ${data.nombre}</p><img class="image_" src="${data.imageUrl}" alt="Imagen">`;
        document.getElementById('chat').style.display = 'block';
        
        nombreUsuario = document.getElementById('nombre').value;
        imagenFile = document.getElementById('imagen').files[0];

        form.reset();
      });

      mensajes.addEventListener('submit', function(event) {
        event.preventDefault();//evita enviar el formulario
        var mensaje = document.getElementById('mensaje').value;

        if (mensaje.trim() !== '') {
          socket.emit('chat message', { imagen: imagenFile, nombre: nombreUsuario, mensaje: mensaje });
          document.getElementById('mensaje').value = '';
        } else {
          alert('Por favor ingrese un mensaje válido.');
        }
      });

       // Función para recibir mensajes del servidor
        socket.on('chat message', function(data) {
            var listaMensajes = document.getElementById('lista-mensajes');
            var mensaje = document.createElement('li');
            mensaje.textContent = data.imagenFile+':'+data.nombre + ': ' + data.mensaje;
            listaMensajes.appendChild(mensaje);
        });



      

    });