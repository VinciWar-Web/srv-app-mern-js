const { request, response } = require('express')
const Permission = require('../models/permission.model');

// GET: Obtener todos los permisos
const permissionsAllGET = async (req = request, res = response) => {
    try {
        const permissions = await Permission.find()
        res.json({
            totalPermissions: permissions.length,
            permissions
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Error al obtener permisos' })
    }
}

// GET: Obtener un permiso por ROL
const permissionByRoleGET = async (req = request, res = response) => {
    try {
        const { rol } = req.params
        const permission = await Permission.findOne({ rol })
        if (!permission) {
            return res.status(404).json({ msg: `No se encontraron permisos para el rol ${rol}` })
        }
        res.json(permission)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Error al obtener permisos del rol' })
    }
}

module.exports = {
    permissionsAllGET,
    permissionByRoleGET
}
