module.exports = app => {
    const venta = require("../controllers/ventadao.controller.js");
    var router = require("express").Router();
    router.post("/", venta.create);
    router.get("/", venta.findAll);
    router.get("/:id", venta.findOne);

    // Agregar una ruta para la eliminación de ventas por ID
    router.delete("/:id", venta.delete);

    // Agregar una ruta para la edición de ventas por ID
    router.put("/:id", venta.update)
    app.use('/api/venta', router);
};