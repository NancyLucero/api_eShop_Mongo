// invocamos a express
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");


// middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));

// Invocamos a dotenv
require("dotenv/config");
const api = process.env.API_URL;

// Directirio public
app.use(express.static('public'))
app.use('/', express.static('public'));
app.use('/', express.static(__dirname + 'public'));

// establecer el motor de plantillas ejs - 
app.set('view engine', 'ejs')

// variables de session
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// https://www.youtube.com/watch?v=3SOaTx6hxno&list=PLrAw40DbN0l3X-ol5MHc9UeyfdTcDCPcy
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// rutas

const productoRouter = require("./routers/productos");
const userRouter = require("./routers/users");
const categoriaRouter = require("./routers/categorias");
const pedidoRouter = require("./routers/pedidos");
const homeRouter = require("./routers/home");

app.use("/productos", productoRouter);
app.use("/users", userRouter);
app.use("/categorias", categoriaRouter);
app.use("/pedidos", pedidoRouter);
app.use("/", homeRouter);

// FUNCIONES

function calcularTotal(carrito, req){
  total=0;
  for(let i=0; i<carrito.length;i++){
      total=total + (carrito[i].precio*carrito[i].cantidad);
  }
  req.session.total=total;
  return total;
}


// login
app.get('/login', (req, res) => {
  res.render('login')
})

// logout
app.get(`/logout`, (req, res) => {
  req.session.destroy(() => {
      res.redirect('/')
  })
})

// carrito
app.get('/carrito', (req, res) => {
  if (req.session.carrito){        
    var carritos = req.session.carrito;    
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
                total:0
            }) 
  }else{
      res.render('carrito',{
        cart:false,
        carritos:carritos,
        carrito:false,
        cant:0,
        login:false,
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


// CONTACTO
app.get('/contacto', (req, res) => {
  
  res.render('contacto',{
    login:false
  })
})

// conectar a la BD
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("BD conectada");
  })
  .catch((err) => {
    console.log(err);
  });

// iniciar servidor

app.listen(3000, () => {
  //console.log(api);
  console.log("Servidor ejecutandose");
});
