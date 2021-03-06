// funciones para renderizar usuarios
var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
// referencias Jquery

var divUsuarios = $('#divUsuarios');
var formEnviar = $('#enviar');
var txtMensaje = $('#txtMensaje');
var divChatBox = $('#divChatbox');
// espera un arreglo
function renderizarUsuarios(personas) {
    // console.log(personas);

    var html = '';

    html += ' <li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';

    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '<a data-id="' + personas[i].idPersona + '"href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombrePersona + '<small class="text-success">online</small></span></a>';
        html += '<li>';

    }

    divUsuarios.html(html);

}

function renderizarMensajes(mensaje, yo) {
    var html = '';
    var adminClas = 'info';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();
    if (mensaje.nombre === 'Administrador') {
        adminClas = 'danger';
    }
    if (yo) {

        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '<div class="chat-time">' + hora + '</div>';
    } else {
        html += ' <li class="animated fadeIn">';
        if (mensaje.nombre != 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }

        html += '<div class="chat-content">';
        html += '  <h5>' + mensaje.nombre + '</h5>';
        html += '  <div class="box bg-light-' + adminClas + '">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';



    }


    divChatBox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatBox.children('li:last-child');


    // heights
    var clientHeight = divChatBox.prop('clientHeight');
    var scrollTop = divChatBox.prop('scrollTop');
    var scrollHeight = divChatBox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatBox.scrollTop(scrollHeight);
    }
}


// Listeners

divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');
    if (id) {
        console.log(id);
    }

});

formEnviar.on('submit', function(e) {
    // para que no funcione el submit
    e.preventDefault();
    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        // Para que el mouse quede hay cuando presione el btn de enviar mensaje
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
        // console.log(mensaje);
    });
});