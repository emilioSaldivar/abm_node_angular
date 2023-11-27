const { Sequelize } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Orden = sequelize.define("Orden", {
        cliente: {
            type: Sequelize.STRING
        },
        monto_envio: {
            type: Sequelize.BIGINT
        },
        nro_orden: {
            type: Sequelize.STRING
        },
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        direccion: {
            type: Sequelize.STRING
        }
    });
    return Orden;
};
