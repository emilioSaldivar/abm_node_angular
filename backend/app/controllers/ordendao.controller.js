const db = require("../models");
const Ordenes = db.Ordenes;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.nro_orden) {
        res.status(400).send({
            message: "Debe enviar el número de orden."
        });
        return;
    }

    // Crea una orden
    const orden = {
        cliente: req.body.cliente,
        monto_envio: req.body.monto_envio,
        nro_orden: req.body.nro_orden,
        direccion: req.body.direccion
    };

    // Guarda en la base de datos
    Ordenes.create(orden)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear una orden."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    Ordenes.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al obtener orden con id=" + id
            });
        });
};

exports.findAll = (req, res) => {
    const cliente = req.query.cliente;
    var condition = cliente ? { cliente: { [Op.iLike]: `%${cliente}%` } } : null;
    Ordenes.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrió un error al obtener las órdenes."
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;
    Ordenes.destroy({ where: { id: id } })
        .then(() => {
            res.send({ message: 'Orden eliminada exitosamente.' });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al eliminar orden con id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;
    Ordenes.findByPk(id)
        .then(orden => {
            if (!orden) {
                return res.status(404).send({ message: "Orden no encontrada." });
            }

            // Actualiza los campos con los datos del cuerpo de la solicitud
            orden.cliente = req.body.cliente;
            orden.monto_envio = req.body.monto_envio;
            orden.nro_orden = req.body.nro_orden;
            orden.direccion = req.body.direccion;

            // Guarda la orden actualizada
            orden.save()
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Error al actualizar la orden con id=" + id
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al obtener orden con id=" + id
            });
        });
};
