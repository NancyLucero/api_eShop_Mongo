// invocamos a express
const {Producto} = require('../models/producto');
const {Categoria} = require('../models/categoria');
const express = require('express');
const router= express.Router();
const mongoose = require('mongoose');

// funciones para calcular cuando se selecciona un producto

function productoEnCarrito(carrito,id){
    for(let i=0; i<carrito.length; i++){
        if (carrito[i].idProducto==id){
            return true;
        }
    }
    return false;
  }
  
  function calcularTotal(carrito, req){
    total=0;
    for(let i=0; i<carrito.length;i++){
        total=total + (carrito[i].precio*carrito[i].cantidad);
    }
    req.session.total=total;
    return total;
  }

// EJEMPLO
//http://localhost:3000/productos?categorias=64aab34506801491d9e95857


//====== trae todos los productos ========

router.get(`/`, async (req,res)=>{
    let filter ={};
    if (req.query.categorias){
        filter = {categoria: req.query.categorias.split(',')}
    }
    const productoLista= await Producto.find(filter);
    //const productoLista= await Producto.find().select('nombre precio');
    if (!productoLista){
        res.status(500).json({success:false})
    }
    res.send(productoLista);
})

//====== trae todos los productos y los envia a comercio ========

router.get(`/comercio`, async (req,res)=>{
    let filter ={};
    if (req.query.categorias){
        filter = {categoria: req.query.categorias.split(',')}
    }
    const productoLista= await Producto.find(filter);
    if (!productoLista){
        res.status(500).json({success:false})
    }
    let login=false;
    let name="";    
    if (req.session.loggedin) {
        login=true
        name= req.session.name
    }
    var carritos = req.session.carrito;
    if (req.session.carrito){
        cant= carritos.length;
    }else{
        cant=0;
    }
    return res.render('comercio', { 
        products:productoLista , 
        login:login, 
        name:name,
        cart:true,
        carrito:true,
        cant:cant,
        carritos:carritos
    });
    //res.send(productoLista);
})

//====== trae un producto por id ========

router.get(`/:id`, async (req,res)=>{
    // busca y trae detalles de la categoria da error 
    //const producto= await Producto.findById(req.params.id).populate('categoria');
    // busco con id 
    const producto= await Producto.findById(req.params.id);
    if (!producto){
        res.status(500).json({success:false})
    }
    res.send(producto);
})

//====== agrega un producto ========

router.post(`/`,async(req,res)=>{
    const categoria = await Categoria.findById(req.body.categoria);
    if (!categoria) return res.status(400).send('Categoria invalida')

    const producto = new Producto({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        categoria: req.body.categoria,
        autor: req.body.autor,
        precio: req.body.precio,
        precioLista: req.body.precioLista,
        stock: req.body.stock,
        imagen: req.body.imagen,
        activo: req.body.activo,
        medida: req.body.medida
    })
    
    await producto.save().then((crearProducto=>{
        res.status(201).json(crearProducto)
    })).catch((err)=>{
        res.status(500).json({
            error:err,
            success: false
        })
    }) 
})

//====== actualiza un producto ========

router.put(`/:id`,async(req,res)=>{
    if (!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Producto invalido')
    }
    const categoria = await Categoria.findById(req.body.categoria);
    if (!categoria) return res.status(400).send('Categoria invalida')

    const producto= await Producto.findByIdAndUpdate(
        req.params.id,
        {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            categoria: req.body.categoria,
            autor: req.body.autor,
            precio: req.body.precio,
            precioLista: req.body.precioLista,
            stock: req.body.stock,
            imagen: req.body.imagen,
            activo: req.body.activo,
            medida: req.body.medida
        },
        {new:true}
    )
    if (!producto)
    return res.status(500).send('No pudo modificarse el producto')
    
    res.send(producto)
})

//====== borra un producto ========

router.delete(`/:id`,async(req,res)=>{
    Producto.findByIdAndRemove(req.params.id).then(producto=>{
        if (producto){
            return res.status(200).json({success:true,message:'producto eliminado'})
        }else{
            return res.status(404).json({success:false,message:'producto inexistente'})
        }
    }).catch(err=>{
        return res.status(400).json({success:false,error:err}) 
    })
})
/*
 funcion para contar cantidad de productos pero no funciona
error -> MongooseError('Model.countDocuments() no longer accepts a callback')
*/
router.get(`/get/count`, async (req,res)=>{
    const productoCount = await Producto.find().count()

    if (!productoCount){
        res.status(500).json({success:false})
    }
    res.send({
        productoCount: productoCount
    });
})


// ======== busca todos los productos activos =========

router.get(`/get/activos`, async (req,res)=>{
    const productos = await Producto.find({activo:'S'})

    if (!productos)
    res.status(500).json({success:false})
    
    res.send(productos);
})

// ======= busca todos los productos categorias ==========

router.get(`/get/prodPorCat`, async (req,res)=>{
    //const productos = await Producto.find({categoria:'64aab3d312ccb10f217bd876'})
    const productos = await Producto.find({categoria:["64aab3d312ccb10f217bd876","64aab34506801491d9e95857"]})

    if (!productos)
    res.status(500).json({success:false})
    
    res.send(productos);
})

// ================ FUNCIONALIDAD CARRITOS ==========================


// ====== agregar producto al carrito =========

router.post(`/agregar`, (req,res)=>{    
    if (req.session.loggedin){
        var id= req.body.idProducto
        var nombre= req.body.nombre
        var precio= req.body.precio
        var imagen= req.body.imagen
        var cantidad= req.body.cantidad
        var producto = {idProducto:id,nombre:nombre,precio:precio,imagen:imagen,cantidad:cantidad}                
        if (req.session.carrito){            
            var carritos = req.session.carrito;
            if (!productoEnCarrito(carritos,id)){
                carritos.push(producto);
            }else{
                return res.render('carrito',{
                    cart:true,
                    carritos:carritos,
                    carrito:true,
                    cant:carritos.length,
                    login:true,
                    name:req.session.name,
                    total:req.session.total,
                    alert:true,
                    alertTitle: "Productos",
                    alertMessage: "Producto ya existe en el carrito",
                    alertIcon: 'warning',
                    showConfirmButton:false,
                    timer:2200,
                    ruta:'./productos/comercio'
                })
            }
        }else{            
            req.session.carrito=[producto];
            var carritos = req.session.carrito;
        }
        // calcular el total
        calcularTotal(carritos,req);
        
        // ir a pagina carrito

        // para redireccionar se debe enviar parametros
        //return res.redirect('/carro/carrito');
        
        
        res.render('carrito',{
                    cart:true,
                    carritos:carritos,
                    carrito:true,
                    cant:carritos.length,
                    login:true,
                    name:req.session.name,
                    total:req.session.total,
                    alert:true,
                    alertTitle: "Productos",
                    alertMessage: "producto agregado al carrito",
                    alertIcon: 'success',
                    showConfirmButton:false,
                    timer:1800,
                    ruta:'./productos/comercio'
                })
    }else{
        res.render('login',{
            alert:true,
            alertTitle: "Advertencia",
            alertMessage: "Debe iniciar session",
            alertIcon: 'warning',
            showConfirmButton:false,
            timer:1800,
            ruta:'login'
        })
    }
  })

// ====== quitar producto del carrito ========

router.post(`/quitarProducto`, (req,res)=>{
    var id=req.body.id;
    var carritos = req.session.carrito;
    for(let i=0;i<carritos.length;i++){
        if(carritos[i].idProducto==id){
            carritos.splice(i,1);
        }
    }
    // recalcular total

    calcularTotal(carritos,req);

    return res.redirect('/carro/carrito')
  })

 

  module.exports=router;