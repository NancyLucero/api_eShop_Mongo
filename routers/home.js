// invocamos a express
const {Producto} = require('../models/producto');
const {Categoria} = require('../models/categoria');
const express = require('express');
const router= express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req,res)=>{
    let filter ={};
    if (req.query.categorias){
        filter = {categoria: req.query.categorias.split(',')}
    }
    const productoLista= await Producto.find(filter);
    //const productoLista= await Producto.find().select('nombre precio');
    if (!productoLista){
        return res.status(500).json({success:false})
    }
    //res.send(productoLista);

    if (req.session.loggedin) {
        if (req.session.carrito){
            var carritos = req.session.carrito
            cant= carritos.length
        }else{
            cant=0
        }
        return res.render('home', {
            login: true,
            carrito:true,
            cant:cant,
            name: req.session.name,
            products: productoLista
        });
    } else {
        return res.render('home', {
            login: false,
            carrito:false,
            cant:0,
            //name: req.session.name,
            products: productoLista
        });
    }
})

module.exports=router;