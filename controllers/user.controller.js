const { request, response } = require('express')
const bcryptjs = require('bcryptjs')
const User = require('../models/user.model')     

// Controlador para obtener todos los usuarios paginados
const usersAllGET = async (req = request, res = response) => {

    const { page = 0, limit = 10 } = req.query
    const query = { state: true }

    // Metodo independiente - Traemos solo los usuarios con estado en true
    /* const users = await User.find( query )
        .skip( Number(page) )
        .limit( Number(limit) ) */
    
    // Metodo independiente - Tenemos el total de todos los usuarios con estados en true
    // const totalUsers = await User.countDocuments( query )  

    // Desestructuramos el array con el Promise para ejecutar 2 promesas al tiempo
    const [ totalUsers, users ] = await Promise.all([
        // Tenemos el total de todos los usuarios con estados en true
        User.countDocuments( query ), 
        
        // Traemos solo los usuarios con estado en true
        User.find( query ) 
            .skip( Number(page) )
            .limit( Number(limit) )
    ])

    res.json({
        totalUsers,
        users
    })
}

// Controlador para obtener 1 usuario
const userGET = async (req, res = response) => {

    const { id } = req.params

    const user = await User.findById( id )

    res.json({
        user,
    })

}

// Controlador para crear un usuario 
const userPOST = async (req = request, res = response) => {

    const { name, email, password, img, rol, state, google } = req.body
    const user = new User({ name, email, password, img, rol, state, google })

    // Encriptar la contraseña 
    const salt = bcryptjs.genSaltSync()
    user.password = bcryptjs.hashSync( password, salt )

    // Guaradar en DB
    await user.save()

    res.json({
        msj: 'Usuario creado con exito',
        user,
    })
}

// Controlador para editar un usuario
const userPUT = async (req = request, res = response) => {

    const { id } = req.params
    // Excluimos la actualización de _id, password, google, mail y el ...rest se puede actualizar 
    const { _id, password, google, mail, ...rest } = req.body

    // Validamos contra la base de datos
    if( password ){
        // Encriptar la contraseña 
        const salt = bcryptjs.genSaltSync()
        rest.password = bcryptjs.hashSync( password, salt )
    }

    const user = await User.findByIdAndUpdate( id, rest )

    res.json({
        msj: 'Usuario actualizado con exito',
        user
    })
}

// Controlador para deshabilitar un usuario
const userDELETE = async (req, res = response) => {

    const { id } = req.params

    // Modelo para eliminar usuario fisicamente 
    //const user = await User.findByIdAndDelete( id )

    const { name, state } = await User.findByIdAndUpdate( id, { state: false } )

    if ( state ){
        res.json({
            msj: `Usuario ${ name } eliminado con exito`
        })
    }else{
        res.json({
            msj: `El suario ${ name } ya fue eliminado anteriormente`
        })
    }
}

module.exports = {
    usersAllGET,
    userGET,
    userPOST,
    userPUT,
    userDELETE
}