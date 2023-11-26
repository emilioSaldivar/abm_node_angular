const db = require("../models");
const Ventas = db.Ventas;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
    // Validate request
    if (!req.body.nro_orden) {
        res.status(400).send({
            message: "Debe enviar numero de orden!"
        });
        return;
    }
    // crea una venta
    const venta = {
        cliente: req.body.cliente,
        nro_orden: req.body.nro_orden,
        monto_envio: req.body.monto_envio,
        direccion: req.body.direccion
    };
    // Guardamos a la base de datos
    Ventas.create(venta)
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
    Ventas.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al obtener venta con id=" + id
            });
        });
};

exports.findAll = (req, res) => {
    const nombre = req.query.nombre;
    var condition = nombre ? { cliente: { [Op.iLike]: `%${nombre}%` } } : null;
    Ventas.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener las orden."
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;
    Ventas.destroy({ where: { id: id } })
        .then(() => {
            res.send({ message: 'orden eliminada exitosamente.' });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al eliminar orden con id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;
    Ventas.findByPk(id)
        .then(venta => {
            if (!venta) {
                return res.status(404).send({ message: "Orden no encontrada." });
            }

            // Actualiza los campos con los datos del cuerpo de la solicitud
            venta.cliente = req.body.cliente;
            console.log('venta.cliente', venta.cliente)
            venta.nro_orden = req.body.nro_orden;
            console.log('venta.factura', venta.nro_orden)
            venta.monto_envio = req.body.monto_envio;
            console.log('venta.total', venta.monto_envio)
            venta.direccion = req.body.direccion;
            console.log('venta.direccion', venta.direccion)

            // Guarda la venta actualizada
            venta.save()
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Error al actualizar la venta con id=" + id
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al obtener venta con id=" + id
            });
        });
};