const Role = require('../models/role.model')
const User = require('../models/user.model')     

// Verificar si el rol no esta registrado
const validatorRole = async( rol = '' ) => {

    const existsRol = await Role.findOne({ rol })

    if( !existsRol ){
        throw new Error(`EL rol ${ rol } no esta registrado en la DB`)
    }
}

// Verificar si el correo existe 
const emailExists = async( email = '' ) => {

    const existMail = await User.findOne({ email })

    if( existMail ){
        throw new Error(`El correo ${ email }, ya se encuentra registrado`)
    }
}

// Verificar si el usuario por ID existe
const userExistsByID = async( id ) => {

    const userExist = await User.findById( id )

    if( !userExist ){
        throw new Error(`El ID ${ id } no existe`)
    }
}

module.exports = {
    validatorRole,
    emailExists,
    userExistsByID
}