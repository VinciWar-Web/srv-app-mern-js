const { request, response } = require('express')

const isAdminRole = async ( req = request, res = response, next ) => {

    if( !req.user ){
        return res.status(500).json({
            msj: 'Estás intentando verificar el rol sin validar el token primero.'
        })
    }

    const { name, rol } = req.user

    if( rol !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msj: `El usuario ${name} no cuenta con los privilegios de administrador para llevar a cabo esta acción.`
        })
    }

    next()// Función next para continuar con el siguiente middleware si todo es correcto
 
}

module.exports = {
    isAdminRole
}