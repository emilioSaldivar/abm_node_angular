module.exports = (sequelize, Sequelize) => {
    const Venta = sequelize.define("Ordenes", {
        cliente: {
            type: Sequelize.STRING
        },
        monto_envio: {
            type: Sequelize.BIGINT
        },
        nro_orden: {
            type: Sequelize.STRING
        },
        direccion:{
            type: Sequelize.STRING
        },
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        }
    });
    return Venta;
};