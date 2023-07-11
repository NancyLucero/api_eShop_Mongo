const {Pedido} = require('../models/pedido');
const {itemsPedido} = require('../models/itemsPedido');
const express = require('express');
const router= express.Router();

// BUSCAR PEDIDO

router.get(`/`, async (req,res)=>{
    const pedidoLista= await Pedido.find();
    if (!pedidoLista){
        res.status(500).json({success:false})
    }
    res.status(200).send(pedidoLista);
})


// GRABA PEDIDO

router.post(`/`,async(req,res)=>{
    const itemsId = Promise.all(req.body.carritoItems.map(async carritoItem =>{
        let newCarritoItem = new itemsPedido({
            cantidad: carritoItem.cantidad,
            producto: carritoItem.id
        })

        newCarritoItem = await newCarritoItem.save();
        return newCarritoItem._id;
    }))

    const itemsIdResuelto = await itemsId;
    console.log(itemsIdResuelto)
    let pedido = new Pedido({
        pedidoItems: itemsIdResuelto,
        direccion: req.body.direccion,
        ciudad: req.body.ciudad, 
        telefono: req.body.telefono,
        estado: req.body.estado,
        totalPago: req.body.totalPago,      
        user: req.body.user,
        fechaPedido: req.body.fechaPedido,
        mail: req.body.mail,
        formaPago: req.body.formaPago,
        tipoEnvio: req.body.tipoEnvio,    
    })
    //pedido = await pedido.save();

    if(!pedido)
    return res.status(404).send('pedido no se pudo ingresar')
    
    res.send(pedido);
})

module.exports=router;