const { request, response } = require('express')
const bcryptjs = require('bcryptjs')
const User = require('../models/user.model')
const Permission = require('../models/permission.model')
const Role = require('../models/role.model')

// GET: Obtener todos los usuarios paginados
const usersAllGET = async (req = request, res = response) => {
  try {
    // Query Parameters (opcionales)
    const { page = 0, limit = 5 } = req.query
    const { rol } = req.user

    // Convertir a números
    const pageNumber = Number(page)
    const limitNumber = Number(limit)
    const skip = pageNumber * limitNumber // Cálculo de documentos a omitir

    const query =
      rol === 'ADMIN_ROLE'
        ? {} // Admin ve todos los usuarios
        : { state: true, rol: { $in: ['SALES_ROLE', 'USER_ROLE'] } } // Otros roles SALES_ROLE, USER_ROLE ven solo usuarios activos específicos

    const totalUsers = await User.countDocuments(query) // Total de usuarios
    const totalPages = Math.ceil(totalUsers / limitNumber) // Total de páginas

    // Retorna respuesta vacía si la página no existe
    if (pageNumber >= totalPages) {
      return res.json({
        totalUsers,
        totalPages,
        currentPage: pageNumber,
        users: [],
        message: 'No hay más usuarios disponibles',
      })
    }

    const users = await User.find(query)
      .sort({ _id: 1 })    // Orden ascendente por ID
      .skip(skip)          // Omite documentos según página
      .limit(limitNumber)  // Limita resultados por página
      .select('-password') // Excluye contraseñas de la respuesta

    res.json({
      totalUsers,
      totalPages,
      currentPage: pageNumber,
      users,
    })
  } catch (error) {
    console.error('=== ERROR ===')
    console.error(error)
    res.status(500).json({ msj: 'Error al obtener los usuarios' })
  }
}

// GET: Obtener 1 usuario
const userGET = async (req, res = response) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).select('-password')

        if (!user) {
            return res.status(404).json({ msj: 'Usuario no encontrado' })
        }

        res.json({ 
            user 
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msj: 'Error al obtener el usuario' })
    }
}

// POST: Crear un usuario
const userPOST = async (req = request, res = response) => {
    try {
        const { name, email, password, img, rol, state, google } = req.body

        // Validar que el rol existe en la DB
        const roleDoc = await Role.findOne({ rol: rol.toUpperCase().trim() });
        if (!roleDoc) {
            return res.status(400).json({
                msg: `El rol ${rol} no está registrado en la DB`
            })
        }

        // Buscar permisos asociados al rol
        const permissionDoc = await Permission.findOne({ rol })
        const permissions = permissionDoc?.permissions || []

        // Crear usuario con permisos del rol
        const user = new User({
            name,
            email,
            password,
            img,
            rol: rol.toUpperCase().trim(),
            state,
            google,
            permissions
        })

        // Encriptar la contraseña del usuario
        const salt = bcryptjs.genSaltSync()
        user.password = bcryptjs.hashSync(password, salt)

        // Guaradar en DB
        await user.save()

        res.status(201).json({
            msj: 'Usuario creado con éxito',
            user
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msj: 'Error al crear el usuario' })
    }
}

// PUT: Editar un usuario
const userPUT = async (req = request, res = response) => {
    try {
        const { id } = req.params
        const { _id, password, google, mail, ...rest } = req.body

        // Validamos contra la base de datos
        if (password) {
            const salt = bcryptjs.genSaltSync()
            rest.password = bcryptjs.hashSync(password, salt)
        }

        const user = await User.findByIdAndUpdate(id, rest, { new: true })

        if (!user) {
            return res.status(404).json({ msj: 'Usuario no encontrado' })
        }

        res.json({
            msj: 'Usuario actualizado con éxito',
            user
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msj: 'Error al actualizar el usuario' })
    }
}

// DELETE: Deshabilitar un usuario
const userDELETE = async (req, res = response) => {
    try {
        const { id } = req.params

        // Buscar el usuario primero para ver su estado actual
        const user = await User.findById(id)

        // Verificar si ya está eliminado
        if (!user.state) {
            return res.json({ msj: `El usuario ${user.name} ya fue eliminado anteriormente` })
        }

        // Eliminar (cambiar state a false)
        await User.findByIdAndUpdate(id, { state: false })
        
        res.json({ msj: `Usuario ${user.name} fue eliminado con éxito` })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msj: 'Error al eliminar el usuario' })
    }
}

module.exports = {
    usersAllGET,
    userGET,
    userPOST,
    userPUT,
    userDELETE
}
