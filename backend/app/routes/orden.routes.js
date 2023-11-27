module.exports = app => {
    const orden = require("../controllers/ordendao.controller.js");
    var router = require("express").Router();

    // Ruta para crear una orden
    router.post("/ordenes", orden.create);

    // Ruta para obtener todas las ordenes
    router.get("/ordenes", orden.findAll);

    // Ruta para obtener una orden por ID
    router.get("/ordenes/:id", orden.findOne);

    // Ruta para eliminar una orden por ID
    router.delete("/ordenes/:id", orden.delete);

    // Ruta para actualizar una orden por ID
    router.put("/ordenes/:id", orden.update);

    app.use('/api', router);
};
