const { request, response } = require('express')
const Role = require('../models/role.model')

// GET: Obtener todos los roles
const rolesAllGET = async (req = request, res = response) => {
    try {
        const roles = await Role.find()
        res.json({ 
          totalRoles: roles.length, 
          roles 
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msj: 'Error al obtener los roles' })
    }
}

// GET: Obtener un rol por ID
const roleGET = async (req = request, res = response) => {
    try {
        const { id } = req.params
        const role = await Role.findById(id)

        if (!role) {
            return res.status(404).json({ msj: 'Rol no encontrado' })
        }

        res.json(role)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msj: 'Error al obtener el rol' })
    }
}

module.exports = {
    rolesAllGET,
    roleGET
}
