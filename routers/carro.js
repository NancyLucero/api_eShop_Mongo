const express = require('express');
const router= express.Router();
const mongoose = require('mongoose');

// FUNCIONES

function calcularTotal(carrito, req){
    total=0;
    for(let i=0; i<carrito.length;i++){
        total=total + (carrito[i].precio*carrito[i].cantidad);
    }
    req.session.total=total;
    return total;
}
  

// ========== muestra carrito =========

router.get('/carrito', (req, res) => {
    if (req.session.carrito && cant!=0){        
        var carritos = req.session.carrito; 
        var total = req.session.total;   
     
        // calcular el total
        calcularTotal(carritos,req);    
      
        // ir a pagina carrito             
        res.render('carrito',{
            cart:true,
            carritos:carritos,
            carrito:true,
            cant:carritos.length,
            login:true,
            total:total,
            name:req.session.name,
            producto:producto
            }) 
    }else{
        res.render('carrito',{
          cart:false,
          carritos:carritos,
          carrito:false,
          cant:0,
          login:false,
          total:req.session.total,
          name:req.session.name,
          total:0,
          alert:true,
        alertTitle: "Advertencia",
        alertMessage: "No tiene productos en el carrito",
        alertIcon: 'warning',
        showConfirmButton:false,
        timer:1800,
        ruta:'/'
        })
    }
})
  
// ========= incrementa/decrementa cantidad de productos del carrito =======
  
router.post('/editarCantidad',(req,res)=>{
    var id=req.body.id;
    var cant=req.body.cantidad;
    var incrementar_btn=req.body.incrementar;
    var decrementar_btn=req.body.decrementar;
    var carritos = req.session.carrito;
  
    if (incrementar_btn){
        for(let i=0; i<carritos.length; i++){
            if (carritos[i].idProducto==id){
                if (carritos[i].cantidad>0){
                    carritos[i].cantidad=parseInt(carritos[i].cantidad)+1;
                }
            }
        }
    }
  
    if (decrementar_btn){
        for(let i=0; i<carritos.length; i++){
            if (carritos[i].idProducto==id){
                if (carritos[i].cantidad>1){
                    carritos[i].cantidad=parseInt(carritos[i].cantidad)-1;
                }
            }
        }
    }
    calcularTotal(carritos,req);
    return res.redirect('/carro/carrito')
  })
     
  module.exports=router;