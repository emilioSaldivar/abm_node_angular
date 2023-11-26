const express = require("express");
const config = require('./app/config/db.config');
const { Sequelize } = require('sequelize'); // Agrega esta línea

const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models"); // Agrega esta línea

const app = express();

var corsOptions = {
    origin: "http://192.168.0.5:9090"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "Bienvenido Node backend 2020" });
});

// Verifica la conexión a la base de datos
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
    }
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
})();

// Sincroniza los modelos con la base de datos
(async () => {
    try {
        await db.sequelize.sync();
        console.log('Modelos sincronizados con la base de datos.');
    } catch (error) {
        console.error('Error al sincronizar modelos con la base de datos:', error);
    }
})();

require("./app/routes/venta.routes")(app);

const PORT = process.env.PORT || 9090;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}.`);
});
