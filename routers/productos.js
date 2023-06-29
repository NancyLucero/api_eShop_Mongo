// invocamos a express
const {Producto} = require('../models/producto');
const express = require('express');
const router= express.Router();


router.get(`/`, async (req,res)=>{
    const productoLista= await Producto.find();
    if (!productoLista){
        res.status(500).json({success:false})
    }
    res.send(productoLista);
})

router.get(`/:id`, async (req,res)=>{
    const producto= await Producto.findById(req.params.id);
    if (!producto){
        res.status(500).json({success:false})
    }
    res.send(producto);
})

router.post(`/`,(req,res)=>{
    const producto = new Producto({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        autor: req.body.autor,
        precio: req.body.precio,
        precioLista: req.body.precioLista,
        stock: req.body.stock,
        imagen: req.body.imagen,
        activo: req.body.activo
    })
    producto.save().then((crearProducto=>{
        res.status(201).json(crearProducto)
    })).catch((err)=>{
        res.status(500).json({
            error:err,
            success: false
        })
    })    
})

module.exports=router;