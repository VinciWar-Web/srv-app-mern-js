const { Schema, model } = require('mongoose')

const PermissionSchema = new Schema({
    rol: {
        type: String,
        required: true,
        unique: true
    },
    permissions: {
        type: [String], // array de strings
        default: []
    }
}, { timestamps: true })

module.exports = model('Permission', PermissionSchema);
