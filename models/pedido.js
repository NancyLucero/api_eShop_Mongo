const mongoose = require('mongoose');

// schema
const pedidoSchema = mongoose.Schema({
    pedidoItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'detallePedido',
        required:true
    }],
    direccion:{
        type: String,
        require: true,
    },
    ciudad:{
        type: String,
        require: true,
        default: 'salta'
    },
    telefono:{
        type: String,
        require: true,
    },
    estado:{
        type: String,
        require: true,
        default: 'pendiente'
    },
    totalPago:{
        type: Number,
        require: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    fechaPedido:{
        type: Date,
        default: Date.now,
    },
    mail: {
        type: String,
        require: true,
    },
    formaPago: {
        type: String,
        require: true,
        default: 'efectivo'
    },
    tipoEnvio: {
        type: String,
        require: true,
        default: 'retirar local'
    }
})

pedidoSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

pedidoSchema.set('toJSON',{
    virtuals:true,
});


exports.Pedido = mongoose.model('Pedido', pedidoSchema);