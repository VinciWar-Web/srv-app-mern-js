const { request, response } = require('express')

const validateSalesOrUser = (req = request, res = response, next) => {
  try {
    const { rol } = req.body

    if (!['USER_ROLE', 'SALES_ROLE'].includes(rol)) {
      return res.status(403).json({
        msg: 'Solo se pueden crear usuarios con rol USER_ROLE o SALES_ROLE'
      })
    }

    next()
  } catch (error) {
    console.error('Error en validateSalesOrUser:', error)
    return res.status(500).json({ msg: 'Error en el servidor' })
  }
}

module.exports = {
  validateSalesOrUser
}
