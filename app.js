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

// rutas

const productoRouter = require("./routers/productos");
const userRouter = require("./routers/users");
const carritoRouter = require("./routers/carritos");

/*
const productoRouter = require('./routers/shop');*/

app.use("/productos", productoRouter);
app.use("/users", userRouter);

// conectar a la BD
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "lamps",
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
