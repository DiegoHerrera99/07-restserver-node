const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();

const socketController = async ( socket, io ) => {
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);

    if(!usuario){
        return socket.disconnect();
    }

    //Agregar el usuario conectado
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);

    //Conectarlo a una sala especial
    socket.join(usuario.id); //global, socket.id, usuario.id

    //Quitar al usuario desconectado
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });

    socket.on('enviar-mensaje', ({ uid, mensaje }) => {
        if(uid){
            //Mensaje privado
            socket.to(uid).emit('mensaje-privado', {from: usuario.nombre, mensaje});
        }else{
            //Mensaje global
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }
    });
}

module.exports = {
    socketController
}