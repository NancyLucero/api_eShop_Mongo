// invocamos a express
const {User} = require('../models/user');
const express = require('express');
const router= express.Router();
const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');


router.get(`/`, async (req,res)=>{
    const userLista= await User.find().select('-pass');
    if (!userLista){
        res.status(500).json({success:false})
    }
    res.send(userLista);
})


router.get(`/:id`, async (req,res)=>{
    const user= await User.findById(req.params.id);
    if (!user){
        res.status(500).json({message:'usuario inexistente'})
    }
    res.status(200).send(user);
})

// ==== registrar usuario =======

router.post(`/registrar`,async (req,res)=>{    
    const user = new User({
        user: req.body.user,
        name: req.body.name,
        rol: req.body.rol,
        pass: bcrypt.hashSync(req.body.pass)
    })
    await user.save().then((crearUser=>{
        //res.status(201).json(crearUser);
        res.render('login', {
            alert: true,
            alertTitle: "Registracion Exitosa",
            alertMessage: "Alta Correcto",
            alertIcon: 'success',
            showConfirmButton: false,
            timer: 1800,
            ruta: ''
        })
    })).catch((err)=>{
        res.status(500).json({
            error:err,
            success: false
        })
    })
})

// ==== autenticar usuario =======

router.post(`/auth`,async (req,res)=>{
    
    const user = await User.findOne({user:req.body.user})
    if (!user){
        //return res.status(400).json({message:'usuario inexistente'});
        return res.render('login', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Usuario inexistente",
            alertIcon: 'warning',
            showConfirmButton: false,
            timer: 1800,
            ruta: 'login'
        })
    }
    if (user && bcrypt.compareSync(req.body.pass,user.pass)){
    //if (user && req.body.pass===user.pass){

        /*
        const token = jwt.sign(
            {
            userId : user.id
            },
            'secret',
            {expiresIn:'1d'}
        )
        return res.status(200).send({user:user.user, token:token});        
        return res.status(200).json(user)*/
        req.session.loggedin = true
        req.session.name=user.name
        req.session.id=user.id
        return res.render('login', {
            alert: true,
            alertTitle: "Conexion Exitosa",
            alertMessage: "Acceso Correcto",
            alertIcon: 'success',
            showConfirmButton: false,
            timer: 1800,
            ruta: ''
        })
    }else{
        //return res.status(400).json('Contraseña incorrecta');
        return res.render('login', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Contraseña Incorrectas",
            alertIcon: 'error',
            showConfirmButton: false,
            timer: 1800,
            ruta: 'login'
        })
    }   
})

// ==== borrar usuario =======

router.delete(`/:id`,async(req,res)=>{
    User.findByIdAndRemove(req.params.id).then(user=>{
        if (user){
            return res.status(200).json({success:true,message:'usuario eliminado'})
        }else{
            return res.status(404).json({success:false,message:'usuario inexistente'})
        }
    }).catch(err=>{
        return res.status(400).json({success:false,error:err}) 
    })
})

module.exports=router;