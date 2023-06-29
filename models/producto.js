const mongoose = require('mongoose');

// schema
const productoSchema = mongoose.Schema({
    nombre: String,
    descripcion: String,
    autor: String,
    precio: {
        type:Number,
        required:true
    },
    precioLista: Number,
    stock: {
        type:Number,
        required:true
    },
    imagen: String,
    activo: String
})


exports.Producto = mongoose.model('Producto', productoSchema);

