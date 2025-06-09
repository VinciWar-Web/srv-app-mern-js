const { request, response } = require('express')

const validateAdminUser = async ( req = request, res = response, next ) => {

    try {

        // Verificar si el rol del usuario actual es ADMIN_ROLE
        // Si no es ADMIN_ROLE, verificar si está intentando crear un usuario con rol ADMIN_ROLE
        if (req.user.rol !== 'ADMIN_ROLE' && req.body.rol === 'ADMIN_ROLE') {
            return res.status(401).json({ 
                msg: 'No tienes permiso para crear usuarios con el rol Administrador' 
            })
   
        }
    
        next()// Función next para continuar con el siguiente middleware si todo es correcto

    } catch (error) {

        console.error('Error en el middleware validateAdminUser:', error)

        return res.status(500).json({
            msg: 'Hubo un error en el servidor'
        })
        
    }

}

module.exports = {
    validateAdminUser
}