const url = ( window.location.hostname.includes('localhost') )
                ? 'http://localhost:8080/api/auth/'
                :'https://07-restserver-node-production-1c4d.up.railway.app/api/auth/'

//Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const ulMensajesPrivados = document.querySelector('#ulMensajesPrivados');
const btnSalir = document.querySelector('#btnSalir');

let usuario = null;
let socket = null;

//Validar el token del localStorage
const validarJWT = async () => {
    const token = localStorage.getItem('token') || '';

    if(token.length <= 10){
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    };

    const resp = await fetch(url, {
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    usuario = userDB;
    document.title = usuario.nombre;

    conectarSocket();
    
};

const conectarSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('recibir-mensajes', dibujarMensajes);

    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', dibujarPrivados);
};

const dibujarUsuarios = (usuarios = []) => {
    let usersHTML = '';
    usuarios.forEach(({ nombre, uid }) => {
        usersHTML += `
            <li>
                <p>
                    <h5 class="text-success">${nombre}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
    })

    ulUsuarios.innerHTML = usersHTML;

}

const dibujarMensajes = (mensajes = []) => {
    let mensajesHTML = '';
    mensajes.reverse().forEach(({ nombre, mensaje }) => {
        mensajesHTML += `
            <li>
                <p>
                    <span class="text-primary">${nombre}</span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `;
    })

    ulMensajes.innerHTML = mensajesHTML;

}

const privados = [];
const dibujarPrivados = (privado = {}) => {
    privados.push(privado);

    let mensajesHTML = '';
    privados.reverse().forEach(({ from, mensaje }) => {
        mensajesHTML += `
            <li>
                <p>
                    <span class="text-success">${from}</span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `;
    })

    ulMensajesPrivados.innerHTML = mensajesHTML;

}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {

    const mensaje = txtMensaje.value.trim();
    const uid = txtUid.value.trim();

    if(keyCode !== 13){
        return;
    }

    if(mensaje.length === 0){
        return;
    }

    socket.emit('enviar-mensaje', { mensaje, uid });

    txtMensaje.value = '';

});

const main = async () => {
    //Validar JWT
    await validarJWT();
};

main();


//const socket = io();