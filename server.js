const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./conexion");

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente");
});

app.post("/usuarios", async (req, res) => {

    const { nombre, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const sql = `
        INSERT INTO usuario (nombre, email, password)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [nombre, email, hash], (error, resultado) => {

        if (error) {
            console.error("Error al insertar:", error);

            return res.status(500).json({
                mensaje: "Error al registrar usuario"
            });
        }

        res.json({
            mensaje: "Usuario registrado correctamente"
        });
    });
});
app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM usuario WHERE email = ?";

    db.query(sql, [email], async (error, resultados) => {

        if (error) {
            console.error("Error al buscar usuario:", error);

            return res.status(500).json({
                mensaje: "Error en el servidor"
            });
        }

        if (resultados.length === 0) {
            return res.status(401).json({
                mensaje: "Email o contraseña incorrectos"
            });
        }

        const usuario = resultados[0];

        const coincide = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!coincide) {
            return res.status(401).json({
                mensaje: "Email o contraseña incorrectos"
            });
        }

        res.json({
            mensaje: `Bienvenido/a, ${usuario.nombre}`
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});