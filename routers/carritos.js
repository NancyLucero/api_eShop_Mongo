// carrito corresponde al pedido

const {Carrito} = require('../models/carrito');
const express = require('express');
const router= express.Router();


router.get(`/`, async (req,res)=>{
    const carritoLista= await Carrito.find();
    if (!carritoLista){
        res.status(500).json({success:false})
    }
    res.send(carritoLista);
})

router.post(`/`,(req,res)=>{
    const carrito = new Carrito({
        user: req.body.user,
        name: req.body.name,
        rol: req.body.rol,
        pass: req.body.pass
    })
    user.save().then((crearCarrito=>{
        res.status(201).json(crearCarrito)
    })).catch((err)=>{
        res.status(500).json({
            error:err,
            success: false
        })
    })    
})

module.exports=router;