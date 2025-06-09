const { validationResult } = require('express-validator')

const validateFields = ( req, res, next ) => {

    // Recibe los errores de la request
    const errors = validationResult(req)

    // !errors.isEmpty() si hay errores retorne un 400 y pasamos el error que viene del check en la ruta
    // isEmpty() significa: esta vacío
    if( !errors.isEmpty() ){
        return res.status(400).json(errors)
    }

    // Valor requerido del middleware que indica que el codigo continua si no existe error
    next()
}

module.exports = {
    validateFields
}