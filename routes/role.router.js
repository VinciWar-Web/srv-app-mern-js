const { Router } = require('express')
const { check } = require('express-validator')
const { rolesAllGET, roleGET } = require('../controllers/role.controller')
const { validateFields, validateJWT } = require('../middleware')

const router = Router()

router.get('/', [
    validateJWT, // Se requiere un Token para acceder a este recurso
], rolesAllGET)

router.get('/:id', [
    validateJWT, // Se requiere un Token para acceder a este recurso
    check('id', 'No es un ID válido').isMongoId(), // Validamos si el ID enviado en la query es valido
    validateFields // middleware personal para validar los campos
], roleGET)

module.exports = router
