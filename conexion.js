require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT)
});

db.getConnection((error, conexion) => {
    if (error) {
        console.error("Error al conectar:", error);
        return;
    }

    console.log("Conectado a MySQL");

    conexion.release();
});

module.exports = db;
