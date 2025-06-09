const { request, response } = require('express')
const jwt = require('jsonwebtoken')

const User = require('../models/user.model') 

const validateJWT = async ( req = request, res = response, next ) => {

    const token = req.header('x-token')

    if( !token ){
        return res.status(401).json({
            msg: '¡Ups! falta el token de acceso'
        })
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRET_OR_PRIVATE_KEY )

        // Leer el usuario que corresponda al uid
        const user = await User.findById( uid )

        // Verifica que el usuario exista
        if( !user ){
            return res.status(401).json({
                msg: '¡Ups! Acceso denegado, el usuario no existe en la BD'
            })
        }

        // Verifica que el usuario este activo
        if( !user.state ){
            return res.status(401).json({
                msg: '¡Ups! Acceso denegado, el usuario se encuentra inactivo'
            })
        }

        // Establecemos la propiedad llamada user en el objeto req
        req.user = user

        next()// Función next para continuar con el siguiente middleware si todo es correcto
        
    } catch (error) {

        console.log(error)

        res.status(401).json({
            msj: 'Acceso denegado. Se requiere un token válido'
        })

    }
}

module.exports = {
    validateJWT
}