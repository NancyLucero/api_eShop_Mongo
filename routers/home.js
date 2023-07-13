// invocamos a express
const {Producto} = require('../models/producto');
const {Categoria} = require('../models/categoria');
const {Diseniador} = require('../models/diseniador');
const express = require('express');
const router= express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req,res)=>{
    let filter ={};
    if (req.query.categorias){
        filter = {categoria: req.query.categorias.split(',')}
    }
    const productoLista= await Producto.find(filter);
    const diseniadores = await Diseniador.find().sort({ vendidos: -1 });
   
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
            products: productoLista,
            diseniadores: diseniadores.slice(0, 2),
        });
    } else {
        return res.render('home', {
            login: false,
            carrito:false,
            cant:0,
            diseniadores: diseniadores.slice(0, 2),
            //name: req.session.name,
            products: productoLista
        });
    }
})



// redireccion pagina producto
router.get('/producto/:id', async (req, res) => {
  const idProducto = req.params.id;

  try {
    const producto = await Producto.findById(idProducto);

    if (!producto) {
      req.flash('error', 'Producto no encontrado');
      return res.redirect('/');
    }

    const diseniador = await Diseniador.findById(producto.infoAutor);

    res.render('producto', {
      product: producto,
      diseniador: diseniador,
      login: false
    });
  } catch (error) {
    req.flash('error', 'Error al obtener el producto');
    res.redirect('/');
  }
});

  
  

// página todos los diseñadores
router.get('/diseniadores', async (req, res) => {
    try {
        const diseniador = await Diseniador.find();
        res.render('diseniadores', {
            login: false,
            diseniadores: diseniador
        });
    } catch (error) {
        console.error('Error al obtener los diseñadores:', error);
        res.redirect('/');
    }
});
  
  

// carreras, pagina de cada diseñador


router.get('/carreras/:id' , async (req,res) => {
    const idDiseniador = req.params.id;
  
    try {
      const diseniador = await Diseniador.findById(idDiseniador);
  
      if (!diseniador) {
        req.flash('error', 'Producto no encontrado');
        return res.redirect('/'); 
      }
  
      res.render('carreras', { 
        diseniadores: diseniador,
        login:false
     });
    } catch (error) {
      req.flash('error', 'Error al obtener el producto');
      res.redirect('/'); 
    }
})


// buscador
router.get('/buscador',(req,res) => {
    res.render('buscador',{
        login:false
    })
    })


module.exports=router;