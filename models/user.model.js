const { Schema, model } = require('mongoose')

const UserSchema = Schema({
    name:{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email:{
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'La contraseña es obigatoria'],
    },
    img:{
        type: String,
    },
    rol:{
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'SALES_ROLE']
    },
    permissions: {
        type: [String], // Puede ser array de strings o array de ObjectId
        default: []
    },
    state:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    },
})

// Excluye en la respuesta la propiedad __v, password y _id y pasa el resto
UserSchema.methods.toJSON = function(){
    const { __v, password, _id, ...user } = this.toObject()
    user.uid = _id // Incluye de nuevo el _id y lo convierte en uid
    return user
}

module.exports = model( 'User', UserSchema )