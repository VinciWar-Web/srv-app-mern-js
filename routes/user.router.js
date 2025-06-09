const { Router } = require('express')
const { check } = require('express-validator')
const { validatorRole, emailExists, userExistsByID } = require('../helpers/db-validators')

const { 
    validateFields, 
    validateJWT, 
    isAdminRole, 
    validateAdminUser
} = require('../middleware')

const { 
    usersAllGET, 
    userGET,
    userPOST, 
    userPUT, 
    userDELETE 
} = require('../controllers/user.controller')
const { validateSalesOrUser } = require('../middleware/validate-user-user copy')

const router = Router()

router.get('/',[
    validateJWT, // Se requiere un Token para acceder a este recurso
], usersAllGET )

router.get('/:id', [
    validateJWT, // Se requiere un Token para acceder a este recurso
    check('id', 'No es un ID valido').isMongoId(), // Validamos si el ID enviado en la query es valido
    check('id').custom( userExistsByID ), // Validamos si existe un usuario por el ID
    validateFields // middleware personal para validar los campos
], userGET )

router.post('/admin',[
    validateJWT, // Se requiere un Token para acceder a este recurso
    validateAdminUser, // Se requiere ser administrador para crear usuarios ADMIN_ROLE
    check('name', 'El nombre es obligatorio').not().isEmpty(), // .not().isEmpty() que no este vacio
    check('email', 'El correo no es válido').isEmail(), // .isEmail() que sea un correo valido
    check('email').custom( emailExists ), // Verificar si el correo existe
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }), // .isLength({ min: 6 }) minimo 6 caracteres
    // check('role', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']), 
    check('rol').custom( validatorRole ), // Validamos si el rol existe en la base de datos
    validateFields // middleware personal para validar los campos
], userPOST )

router.post('/user',[
    validateSalesOrUser, // No se requiere ser administrador para crear usuarios ADMIN_ROLE
    check('name', 'El nombre es obligatorio').not().isEmpty(), // .not().isEmpty() que no este vacio
    check('email', 'El correo no es válido').isEmail(), // .isEmail() que sea un correo valido
    check('email').custom( emailExists ), // Verificar si el correo existe
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }), // .isLength({ min: 6 }) minimo 6 caracteres
    // check('role', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']), 
    check('rol').custom( validatorRole ), // Validamos si el rol existe en la base de datos
    validateFields // middleware personal para validar los campos
], userPOST )

router.put('/:id', [
    validateJWT, // Se requiere un Token para acceder a este recurso
    check('id', 'No es un ID valido').isMongoId(), // Validamos si el ID enviado en la query es valido
    check('id').custom( userExistsByID ), // Validamos si existe un usuario por el ID
    check('rol').custom( validatorRole ), // Validamos si el rol existe en la base de datos
    validateFields // middleware personal para validar los campos
],userPUT )

router.delete('/:id',[
    validateJWT, // Se requiere un Token para acceder a este recurso
    isAdminRole, // Se requiere ser ADMIN_ROLE para acceder a este recurso
    check('id', 'No es un ID valido').isMongoId(), // Validamos si el ID enviado en la query es valido
    check('id').custom( userExistsByID ), // Validamos si existe un usuario por el ID
    validateFields // middleware personal para validar los campos
], userDELETE )

module.exports = router