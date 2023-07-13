const mongoose = require('mongoose');

// schema
const productoSchema = mongoose.Schema({
    nombre: {
        type:String,
        required:true
    },
    descripcion: {
        type:String,
        required:true
    },
    autor: { 
        type:String,
        required:true
    },
    infoAutor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Diseniador',
        required: true
    },
    precio: {
        type:Number,
        required:true
    },
    precioLista: Number,
    stock: {
        type:Number,
        default:0,
        min:0,
        max:300
    },
    imagen: {
        type:String,
        default:''
    },
    imagens: [{
        type:String        
    }],
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    rating: {
        type:Number,
        default:0,
    },
    activo: {
        type:String,
        default:'S'
    },
    medida:{
        type:String
    },
    fuenteLuz:{
        type:String
    },
    voltaje:{
        type:String
    },
    vendidos:{
        type:Number
    },
    img1:{
        type:String
    },
    img2:{
        type:String
    },
    img3:{
        type:String
    },
    img4:{
        type:String
    },
    img5:{
        type:String
    }
})

productoSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

productoSchema.set('toJSON',{
    virtuals:true,
});

exports.Producto = mongoose.model('Producto', productoSchema);


