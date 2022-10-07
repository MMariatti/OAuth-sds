'use strict';
 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

 /* Importamos la ruta a oauth y lo necesario para autenticar con passport */
const passportSetup = require("./config/passport-setup");
const passport = require("passport");
const authRoutes = require("./routers/auth");

// Inicializamos la app
const app = express();

// Inicializamos el passport
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);

/* Conexion a la base de datos */
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log("Database Connected"))
.catch((err) => console.log(err));


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
app.get('/', (req, res) => {
  res.send('Hello World');
});

//route not found
app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});