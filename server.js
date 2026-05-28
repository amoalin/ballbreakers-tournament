const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

let equipos = [];

app.get("/api/equipos", (req, res) => {
  res.json(equipos);
});

app.post("/api/equipos", (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({
      error: "Nombre requerido"
    });
  }

  equipos.push(nombre);

  res.json({
    mensaje: "Equipo agregado",
    equipos
  });
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});