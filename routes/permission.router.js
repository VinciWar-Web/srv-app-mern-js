const { Router } = require('express')
const { check } = require('express-validator')
const { permissionsAllGET, permissionByRoleGET } = require('../controllers/permission.controller')
const { validateFields, validateJWT } = require('../middleware')

const router = Router()

router.get('/', [
    validateJWT // Se requiere un Token para acceder a este recurso
], permissionsAllGET)

router.get('/:rol', [
    validateJWT, // Se requiere un Token para acceder a este recurso
    check('rol', 'El rol es obligatorio').notEmpty(), // Validamos si el rol enviado en la query es valido
    validateFields // middleware personal para validar los campos
], permissionByRoleGET)

module.exports = router
