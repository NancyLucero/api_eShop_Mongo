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

// para traer del body
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// rutas

const productoRouter = require("./routers/productos");
const userRouter = require("./routers/users");
const categoriaRouter = require("./routers/categorias");
const pedidoRouter = require("./routers/pedidos");
const carroRouter = require("./routers/carro");
const homeRouter = require("./routers/home");

app.use("/productos", productoRouter);
app.use("/users", userRouter);
app.use("/categorias", categoriaRouter);
app.use("/pedidos", pedidoRouter);
app.use("/carro", carroRouter);
app.use("/", homeRouter);

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

// registrar
app.get('/registrar',(req,res)=>{
  res.render('registrar')
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
