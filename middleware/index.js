const validateFields = require('../middleware/validate-fields')
const validateJWT = require('../middleware/validate-jwt')
const isAdminRole = require('../middleware/validate-roles')
const validateAdminUser = require('../middleware/validate-admin-user')

module.exports = {
    ...validateFields,
    ...validateJWT,
    ...isAdminRole,
    ...validateAdminUser
}