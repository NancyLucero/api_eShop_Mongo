// invocamos a express
const {User} = require('../models/user');
const express = require('express');
const router= express.Router();


router.get(`/`, async (req,res)=>{
    const userLista= await User.find();
    if (!userLista){
        res.status(500).json({success:false})
    }
    res.send(userLista);
})

router.post(`/`,(req,res)=>{
    const user = new User({
        user: req.body.user,
        name: req.body.name,
        rol: req.body.rol,
        pass: req.body.pass
    })
    user.save().then((crearUser=>{
        res.status(201).json(crearUser)
    })).catch((err)=>{
        res.status(500).json({
            error:err,
            success: false
        })
    })    
})

module.exports=router;