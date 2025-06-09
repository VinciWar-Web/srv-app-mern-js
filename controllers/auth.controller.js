const { request, response } = require('express')
const bcryptjs = require('bcryptjs')
const User = require('../models/user.model') 
const { generateJWT } = require('../helpers/generate-jwt')


const login = async (req = request, res = response) => {

    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        // Verifica si el email existe
        if( !user ){
            return res.status(400).json({
                msg: 'El usuario no es correcto'
            })
        }

        // Verifica si el usuario esta activo
        if( !user.state ){
            return res.status(400).json({
                msg: 'El usuario se encuentra desactivado'
            })
        }

        // Verifica la contraseña
        const validPassword = bcryptjs.compareSync( password, user.password )
        if( !validPassword ){
            return res.status(400).json({
                msg: 'La contraseña no es correcto'
            })
        }

        // Genera el JWT dentro del middleware generateJWT y lo firmamos con el ID del usuario
        const token = await generateJWT( user.id )

        res.json({
            user,
            token
        })

    } catch (error) {

        console.log({error})

        res.status(500).json({
            msg: 'Algo salio mal al hacer login',
        })

    }
}

module.exports = {
    login
}