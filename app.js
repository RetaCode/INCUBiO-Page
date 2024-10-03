const express = require("express");
const morgan = require("morgan");  
const app = express();

const Pool = require("pg").Pool;
const pool = new Pool({
  host: "localhost",
  user: "Soporte",
  password: "re2014416",
  database: "INCUBiO",
  port: 5432,
});

// ----------------------------------------------- Visualizar las rutas en la terminal -----------------------------------------------
app.use(morgan('tiny'));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ----------------------------------------------- Rutas de las Paginas -----------------------------------------------

app.get("/loginUser", (req, res) => {
  res.send("Logeando un nuevo usuario");
});

app.get("/plantas", (req, res) => {
  res.send("Lista las plantas");
});

app.listen(3000, () => {
  console.log("Server on port 3000");
});
