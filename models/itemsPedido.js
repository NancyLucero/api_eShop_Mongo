const mongoose = require('mongoose');

// schema
const itemSchema = mongoose.Schema({
    cantidad: {
        type: Number,
        required:true
    },
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productos',
    }
})

exports.ItemPedido = mongoose.model('ItemPedido', itemSchema);