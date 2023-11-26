module.exports = {
    HOST: "172.17.0.2",
    USER: "postgres",
    PASSWORD: "postgres",
    PORT: 5432, //3333
    DB: "bdpwb",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};