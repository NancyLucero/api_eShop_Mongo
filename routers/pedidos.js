const {Pedido} = require('../models/pedido');

const express = require('express');
const router= express.Router();

// ========= busca pedidos ==========

router.get(`/`, async (req,res)=>{
    const pedidoLista= await Pedido.find();
    if (!pedidoLista){
        res.status(500).json({success:false})
    }
    res.status(200).send(pedidoLista);
})

// ========= busca un pedido ==========

router.get(`/:id`, async (req,res)=>{
    const pedido= await Pedido.findById(req.params.id);
    if (!pedido){
        res.status(500).json({message:'pedido inexistente'})
    }
    res.status(200).send(pedido);
})


// ========= carga un pedido ==========

router.post(`/comprar`,async(req,res)=>{
    // mostrar datos del carrito

    var pedidoItems;
    var item ;
    var carritos = req.session.carrito;
    for(let i=0; i<carritos.length;i++){
        item={cantidad:carritos[i].cantidad,producto:carritos[i].idProducto};
        if (pedidoItems){
            pedidoItems.push(item);
        }else{
            pedidoItems=[item];
        }        
    }
    let pedido = new Pedido({
        pedidoItems: pedidoItems,
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        ciudad: req.body.ciudad, 
        telefono: req.body.telefono,
        mail: req.body.mail,
        totalPago: req.session.total,      
        user: req.session.id,       
        formaPago: req.body.formaPago,
        tipoEnvio: req.body.tipoEnvio,    
    })
    
    if(!pedido)
    return res.status(404).send('pedido no se pudo ingresar')

    await pedido.save().then((crearPedido=>{
        total=0;
        req.session.total=total;
        req.session.carrito=[];
        res.render('carrito',{
            login:true,
            name: req.session.user,
            cart:false,
            alert: true,
            alertTitle: "Pedido Registrado",
            alertMessage: "Muchas gracias por su Compra",
            alertIcon: 'success',
            showConfirmButton: false,
            timer: 1800,
            ruta: ''
        })
    })).catch((err)=>{
        res.status(500).json({
            error:err,
            success:false
        })
    });
})

module.exports=router;