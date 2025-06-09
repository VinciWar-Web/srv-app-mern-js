const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config.db')


class Server {

    constructor(){
        this.app = express()
        this.port = process.env.PORT || 3000

        this.usersPatch = '/api/users'
        this.authPatch  = '/api/auth'

        // Conectar a base de datos
        this.connectDB()

        // Middlewares
        this.middlewares()

        // Rutas de mi aplicación
        this.router()
    }

    async connectDB() {
        await dbConnection()
    }

    middlewares() {
        // CORS
        this.app.use( cors() )
        // Lectura y parceo del body
        this.app.use( express.json() )
        // Directorio Publico
        this.app.use( express.static('public') )
    }

    router() {
        // Directorio Publico
        this.app.use( this.authPatch, require('../routes/auth.router') )
        this.app.use( this.usersPatch, require('../routes/user.router') )
    }

    listen() {
        this.app.listen( this.port, ()=>{
            console.log('Servidor corriendo en el puerto', this.port)
        })
    }

}

module.exports = Server
