const mongoose = require('mongoose');

// schema
const carritoSchema = mongoose.Schema({
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


exports.Carrito = mongoose.model('Carrito', carritoSchema);

