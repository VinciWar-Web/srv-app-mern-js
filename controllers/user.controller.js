const { request, response } = require('express')
const bcryptjs = require('bcryptjs')
const User = require('../models/user.model')     

// Controlador para obtener todos los usuarios paginados
const usersAllGET = async (req = request, res = response) => {
    const { page = 0, limit = 10 } = req.query
    const { rol } = req.user // Desestructuración del rol

    // Construcción del filtro según el rol
    const query = rol === 'ADMIN_ROLE'
        ? {} // Admin ve todos los usuarios
        : {
            state: true,
            rol: { $in: ['SALES_ROLE', 'USER_ROLE'] }
        }

    const [totalUsers, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(page))
            .limit(Number(limit))
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
            msj: `Usuario ${ name } fue eliminado con exito`
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