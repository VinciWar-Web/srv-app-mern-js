const { Router } = require('express')
const { check } = require('express-validator')

const { login } = require('../controllers/auth.controller')
const { validateFields } = require('../middleware/validate-fields')

const router = Router()

router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields // middleware personal para validar los campos
], login )

module.exports = router