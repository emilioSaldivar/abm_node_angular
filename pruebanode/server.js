const express = require("express");

const bodyParser = require("body-parser");

const cors = require("cors");

const app = express();

var corsOptions = {

    origin: "http://localhost:4200"  // Cambia esto a la dirección correcta de tu aplicación Angular

};

app.use(cors(corsOptions));

// parse requests of content-type - application/json

app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: true }));

// simple route

app.get("/", (req, res) => {

    res.json({ message: "Bienvenido Node backend 2020" });

});

require("./app/routes/venta.routes")(app);

// set port, listen for requests

const PORT = process.env.PORT || 9090;

app.listen(PORT, () => {

    console.log('Servidor corriendo en puerto 9090.');

});