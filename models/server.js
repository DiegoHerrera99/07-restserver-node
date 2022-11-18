require('dotenv').config()
const cors = require('cors')
const express = require('express')

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuarios'

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicación
        this.routes()
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
        this.app.use(this.usuariosPath, require('../routes/usuarios'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', process.env.PORT)
        })
    }
}

module.exports = Server;