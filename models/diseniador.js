const mongoose = require('mongoose');

// schema
const diseniadorSchema = mongoose.Schema({
    nombre: {
        type: String,
        required:true
    },
    descripcion: {
        type: String,
        required:true
    },
    imagens: {
        type: String,
        required:true
    }
})


exports.Diseniador = mongoose.model('Diseniador', diseniadorSchema);