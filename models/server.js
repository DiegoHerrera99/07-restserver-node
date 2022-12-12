require('dotenv').config()
const cors = require('cors')
const express = require('express');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8080
        this.usuariosPath = '/api/usuarios'
        this.authPath = '/api/auth'

        //conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicación
        this.routes()
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        
        //cors
        this.app.use(cors())

        //Lectura y parseo del body
        this.app.use(express.json())

        //directorio publico
        this.app.use(express.static('public'))
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'))
        this.app.use(this.usuariosPath, require('../routes/usuarios'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', process.env.PORT)
        })
    }
}

module.exports = Server;